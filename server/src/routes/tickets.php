<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

$app->add(function ($req, $res, $next) {
    $response = $next($req, $res);
    return $response
            ->withHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', '*');
});

$app->group('/tickets', function () {
    $this->get('',function(Request $req,Response $res,array $args) : Response {
        return getAllTickets($req,$res);
    });
    $this->get('/{user_id}',function(Request $req,Response $res,array $args) : Response {
        return getAllUserTickets($req,$res,$args['user_id']);
    });
    $this->post('/add',function(Request $req,Response $res,array $args) : Response {
        return postTicket($req,$res);
    });
    $this->put('/update/{ticket_id}',function(Request $req,Response $res,array $args) : Response {
        return updateTicket($req,$res,$args['ticket_id']);
    });
    $this->delete('/delete/{ticket_id}',function(Request $req,Response $res,array $args) : Response {
        return deleteTicket($req,$res,$args['ticket_id']);
    });
});

// Functions

/**
 * this function returns all tickets in DB
 * @param Request $request
 * @param Response $response
 * @return Response
 */
function getAllTickets(Request $request,Response $response): Response {
    $sql = "SELECT tickets.ticket_id,tickets.user_id, categories.name,tickets.title, tickets.body, tickets.created_at , tickets.status 
    FROM tickets
    LEFT JOIN categories ON tickets.category_id = categories.category_id";

    try {
        $db = new db();
        $db = $db->connect();

        $stmt = $db->query($sql);
        $tickets = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        return $response->withJson($tickets);
    } catch(PDOException $e) {
        return $response->withJson(['error' => e.getMessage()]);
    }
}

/**
 * this function returns specific user's tickets
 * @param Request $request
 * @param Response $response
 * @param int $user_id
 * @return Response
 */
function getAllUserTickets(Request $request,Response $response,$user_id): Response {
    $user_id = $request->getAttribute('user_id');
    $sql ="SELECT tickets.ticket_id,tickets.user_id, categories.name,tickets.title, tickets.body, tickets.created_at , tickets.status 
            FROM tickets
            LEFT JOIN categories ON tickets.category_id = categories.category_id
            WHERE tickets.user_id = '$user_id'";

    try {
        $db = new db();
        $db = $db->connect();

        $stmt = $db->query($sql);
        $tickets = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        return $response->withJson($tickets);
    } catch(PDOException $e) {
        return $response->withJson(['error' => e.getMessage()]);
    }
}

/**
 * this function posts ticket to DB
 * @param Request $request
 * @param Response $response
 * @return Response
 */
function postTicket(Request $request,Response $response) : Response {
    $request->getParsedBody();
    $data = $request->getParsedBody();
    $user_id = $data['user_id'];
    $category_id = $data['category_id'];
    $title = $data['title'];
    $body = $data['body'];
    $status = $data['status'];
    $sql = "INSERT INTO tickets ( user_id, category_id, title, body, status) 
            VALUES (?,?,?,?,?)";

    try{
        $db = new db();
        $db = $db->connect();

        $stmt = $db->prepare($sql);
        $stmt->execute([$user_id,$category_id,$title,$body,$status]);

        // Get Ticket ID
        $ticket_id = $db->lastInsertId();

        // Get Ticket Date
        $sql = "SELECT created_at FROM tickets WHERE ticket_id = $ticket_id";
        $stmt = $db->query($sql);
        $created_at = $stmt->fetchAll(PDO::FETCH_OBJ);
        $created_at = json_decode(json_encode($created_at[0]), true)["created_at"];
        $db = null;
        return $response->withJson(["text" => "new Ticket Added","ticket_id" => $ticket_id, "created_at" =>$created_at]);
    } catch(PDOException $e){
        return $response->withJson(['error' => e.getMessage()]);
    }
}

/**
 * this function updates ticket to DB
 * @param Request $request
 * @param Response $response
 * @param int $ticket_id
 * @return Response
 */
function updateTicket(Request $request,Response $response,$ticket_id) : Response {
    $data = $request->getParsedBody();
    $title = $data['title'];
    $body = $data['body'];
    $status = $data['status'];
    $sql = "UPDATE tickets SET title = ?, body = ?, status = ? WHERE ticket_id = ?";

    try{
        $db = new db();
        $db = $db->connect();

        $stmt = $db->prepare($sql);
        $stmt->execute([$title,$body,$status,$ticket_id]);
        $db = null;

        return $response->withJson(["text" => "Ticket updated","ticket_id" => $ticket_id]);
    } catch(PDOException $e){
        return $response->withJson(['error' => e.getMessage()]);
    }
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

        return $response->withJson(["text" => "Ticket Deleted", "ticket_id" => $ticket_id]);
    } catch(PDOException $e){
        return $response->withJson(['error' => e.getMessage()]);
    }
}