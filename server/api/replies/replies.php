<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * this function returns all replies
 * @param Request $request
 * @param Response $response
 * @return Response
 */
function getAllReplies(Request $request, Response $response) : Response {
    $sql = "SELECT reply_id, ticket_id, user_id, body, type FROM replies";

    try {
        $db = new db();
        $db = $db->connect();
        $stmt = $db->query($sql);
        $replies = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
    } catch(PDOException $e) {
        return $response->withJson(["text" => e.getMessage()]);
    }
    return $response->withJson($replies);
}
/**
 * this function returns all replies
 * @param Request $request
 * @param Response $response
 * @param int $ticket_id
 * @return Response
 */
function getAllTicketReplies(Request $request, Response $response, int $ticket_id) : Response {
    // Fix to 2 different queries
    $sql ="SELECT replies.reply_id, replies.ticket_id, users.username, replies.body, replies.created_at, replies.type  
    FROM replies 
    LEFT JOIN users ON users.user_id = replies.user_id
    WHERE ticket_id = '$ticket_id' ORDER BY created_at ASC";

    try {
        $db = new db();
        $db = $db->connect();
        $stmt = $db->query($sql);
        $replies = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
    } catch(PDOException $e) {
        return $response->withJson(["text" => e.getMessage()]);
    }
    return $response->withJson($replies);
}
/**
 * this function add new reply
 * @param Request $request
 * @param Response $response
 * @return Response
 */
function postReply(Request $request, Response $response) : Response {
    $data = $request->getParsedBody();
    $ticket_id = intval($data['ticket_id']);
    $user_id = intval($data['user_id']);
    $body = strval($data['body'] ?? "" );
    $type = strval($data['type'] ?? "" );
    $sql = "INSERT INTO replies (ticket_id, user_id, body,type) VALUES (?,?,?,?)";

    try{
        $db = new db();
        $db = $db->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute([$ticket_id,$user_id,$body,$type]);
        // Get reply ID
        $reply_id = $db->lastInsertId();
        $db = null;
    } catch(PDOException $e){
        return $response->withJson(["text" => e.getMessage()]);
    }
    return $response->withJson(["text" => "New Reply Added","reply_id" => $reply_id]);
}

/**
 * this function update reply
 * @param Request $request
 * @param Response $response
 * @param int $reply_id
 * @return Response
 */
function updateReply(Request $request, Response $response, int $reply_id) : Response {
    $data = $request->getParsedBody();
    $ticket_id = intval($data['ticket_id']);
    $user_id = intval($data['user_id']);
    $body = strval($data['body'] ?? "" );

    $sql = "UPDATE replies SET ticket_id = ?, user_id = ?, body = ? WHERE reply_id = ?";
    try{
        $db = new db();
        $db = $db->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute([$ticket_id, $user_id,$body,$reply_id]);
        $db = null;
    } catch(PDOException $e){
        return $response->withJson(["text" => e.getMessage()]);
    }
    return $response->withJson(["text" => "Reply updated.", "reply_id" => $reply_id]);
}

/**
 * this function deletes all the ticket replies
 * @param Request $request
 * @param Response $response
 * @param int $ticket_id
 * @return Response
 */
function deleteTicketReplies(Request $request, Response $response, int $ticket_id) : Response {
    $sql = "DELETE FROM replies WHERE ticket_id = ?";
    try{
        $db = new db();
        $db = $db->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute([$ticket_id]);
        $db = null;
    } catch(PDOException $e){
        return $response->withJson(["text" => e.getMessage()]);
    }
    return $response->withJson(["text" => "Replies deleted", "ticket_id" => $ticket_id]);
}