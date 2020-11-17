<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * this function returns all tickets in DB
 * @param Request $request
 * @param Response $response
 * @return Response
 */
function getAllTickets(Request $request, Response $response): Response {
    // Fix to 2 queries
    $sql = "SELECT tickets.ticket_id, tickets.user_id,  categories.name, tickets.title,  tickets.body,  tickets.created_at, tickets.status 
    FROM tickets
    LEFT JOIN categories ON tickets.category_id = categories.category_id";

    try {
        $db = new db();
        $db = $db->connect();
        $stmt = $db->query($sql);
        $tickets = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
    } catch(PDOException $e) {
        return $response->withJson(['error' => e.getMessage()]);
    }
    return $response->withJson($tickets);
}

/**
 * this function returns specific user's tickets
 * @param Request $request
 * @param Response $response
 * @param int $user_id
 * @return Response
 */
function getAllUserTickets(Request $request, Response $response, $user_id): Response {
    $user_id = intval($request->getAttribute('user_id'));
    // Fix to 2 queries
    $sql ="SELECT tickets.ticket_id, tickets.user_id, categories.name, tickets.title, tickets.body, tickets.created_at, tickets.status 
            FROM tickets
            LEFT JOIN categories ON tickets.category_id = categories.category_id
            WHERE tickets.user_id = '$user_id'";

    try {
        $db = new db();
        $db = $db->connect();
        $stmt = $db->query($sql);
        $tickets = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
    } catch(PDOException $e) {
        return $response->withJson(['error' => e.getMessage()]);
    }
    return $response->withJson($tickets);
}

/**
 * this function posts ticket to DB
 * @param Request $request
 * @param Response $response
 * @return Response
 */
function postTicket(Request $request, Response $response) : Response {
    $request->getParsedBody();
    $data = $request->getParsedBody();
    $user_id = $data['user_id'];
    $category_id = $data['category_id'];
    $title = $data['title'];
    $body = $data['body'];
    $status = $data['status'];
    $sql = "INSERT INTO tickets ( user_id, category_id, title, body, status) 
            VALUES (?, ?, ?, ?, ?)";

    try{
        $db = new db();
        $db = $db->connect();

        $stmt = $db->prepare($sql);
        $stmt->execute([$user_id, $category_id, $title, $body, $status]);
        // Get Ticket ID
        $ticket_id = $db->lastInsertId();
        // Get Ticket Date
        $sql = "SELECT created_at FROM tickets WHERE ticket_id = $ticket_id";
        $stmt = $db->query($sql);
        $created_at = $stmt->fetchAll(PDO::FETCH_OBJ);
        $created_at = json_decode(json_encode($created_at[0]), true)["created_at"];
        $db = null;
    } catch(PDOException $e){
        return $response->withJson(['error' => e.getMessage()]);
    }
    return $response->withJson(["text" => "new Ticket Added", "ticket_id" => $ticket_id, "created_at" => $created_at]);
}

/**
 * this function updates ticket to DB
 * @param Request $request
 * @param Response $response
 * @param int $ticket_id
 * @return Response
 */
function updateTicket(Request $request, Response $response, $ticket_id) : Response {
    $data = $request->getParsedBody();
    $title = $data['title'];
    $body = $data['body'];
    $status = $data['status'];
    $sql = "UPDATE tickets SET title = ?, body = ?, status = ? WHERE ticket_id = ?";

    try{
        $db = new db();
        $db = $db->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute([$title, $body, $status, $ticket_id]);
        $db = null;
    } catch(PDOException $e){
        return $response->withJson(['error' => e.getMessage()]);
    }
    return $response->withJson(["text" => "Ticket updated", "ticket_id" => $ticket_id]);
}

/**
 * this function delets ticket from DB
 * @param Request $request
 * @param Response $response
 * @param int $ticket_id
 * @return Response
 */
function deleteTicket(Request $request, Response $response, $ticket_id) : Response {
    $sql = "DELETE FROM tickets WHERE ticket_id = ?";
    try{
        $db = new db();
        $db = $db->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute([$ticket_id]);
        $db = null;
    } catch(PDOException $e){
        return $response->withJson(['error' => e.getMessage()]);
    }
    return $response->withJson(["text" => "Ticket Deleted", "ticket_id" => $ticket_id]);
}