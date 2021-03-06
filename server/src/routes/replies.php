<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

$app->group('/replies', function () {
    $this->get('',function(Request $req,Response $res,array $args) : Response {
        return getAllReplies($req,$res);
    });
    $this->get('/{ticket_id}',function(Request $req,Response $res,array $args) : Response {
        return getAllTicketReplies($req,$res,$args['ticket_id']);
    });
    $this->post('/add',function(Request $req,Response $res,array $args) : Response {
        return postReply($req,$res);
    });
    $this->put('/update/{reply_id}',function(Request $req,Response $res,array $args) : Response {
        return updateReply($req,$res,$args['reply_id']);
    });
    $this->delete('/delete/{ticket_id}',function(Request $req,Response $res,array $args) : Response {
        return deleteTicketReplies($req,$res,$args['ticket_id']);
    });
});

/**
 * this function returns all replies
 * @param Request $request
 * @param Response $response
 * @return Response
 */
function getAllReplies(Request $request,Response $response) : Response {
    $sql = "SELECT * FROM replies";

    try {
        $db = new db();
        $db = $db->connect();
        $stmt = $db->query($sql);
        $replies = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        return $response->withJson($replies);
    } catch(PDOException $e) {
        return $response->withJson(["text" => e.getMessage()]);
    }
}
/**
 * this function returns all replies
 * @param Request $request
 * @param Response $response
 * @param int $ticket_id
 * @return Response
 */
function getAllTicketReplies(Request $request,Response $response,int $ticket_id) : Response {
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

        return $response->withJson($replies);
    } catch(PDOException $e) {
        return $response->withJson(["text" => e.getMessage()]);
    }
}
/**
 * this function add new reply
 * @param Request $request
 * @param Response $response
 * @return Response
 */
function postReply(Request $request,Response $response) : Response {
    $data = $request->getParsedBody();
    $ticket_id = $data['ticket_id'];
    $user_id = $data['user_id'];
    $body = $data['body'];
    $type = $data['type'];
    $sql = "INSERT INTO replies (ticket_id, user_id, body,type) VALUES (?,?,?,?)";

    try{
        $db = new db();
        $db = $db->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute([$ticket_id,$user_id,$body,$type]);

        // Get reply ID
        $reply_id = $db->lastInsertId();
        $db = null;

        return $response->withJson(["text" => "New Reply Added","reply_id" => $reply_id]);
    } catch(PDOException $e){
        return $response->withJson(["text" => e.getMessage()]);
    }
}
/**
 * this function update reply
 * @param Request $request
 * @param Response $response
 * @param int $reply_id
 * @return Response
 */
function updateReply(Request $request,Response $response,int $reply_id) : Response {
    $data = $request->getParsedBody();
    $ticket_id = $data['ticket_id'];
    $user_id = $data['user_id'];
    $body = $data['body'];

    $sql = "UPDATE replies SET ticket_id = ?, user_id = ?, body = ? WHERE reply_id = ?";
    try{
        $db = new db();
        $db = $db->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute([$ticket_id,$user_id,$body,$reply_id]);
        $db = null;

        return $response->withJson(["text" => "Reply updated.", "reply_id" => $reply_id]);
    } catch(PDOException $e){
        return $response->withJson(["text" => e.getMessage()]);
    }
}
/**
 * this function deletes all the ticket replies
 * @param Request $request
 * @param Response $response
 * @param int $ticket_id
 * @return Response
 */
function deleteTicketReplies(Request $request,Response $response,int $ticket_id) : Response {
    $sql = "DELETE FROM replies WHERE ticket_id = ?";
    try{
        $db = new db();
        $db = $db->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute([$ticket_id]);
        $db = null;

        return $response->withJson(["text" => "Replies deleted", "ticket_id" => $ticket_id]);
    } catch(PDOException $e){
        return $response->withJson(["text" => e.getMessage()]);
    }
}