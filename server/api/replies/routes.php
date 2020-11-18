<?php
require 'replies.php';
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

$app->group('/replies', function () {
    $this->get('',function(Request $req, Response $res, array $args) : Response {
        return getAllReplies($req, $res);
    });
    $this->get('/{ticket_id}',function(Request $req, Response $res, array $args) : Response {
        return getAllTicketReplies($req, $res, $args['ticket_id']);
    });
    $this->post('/add',function(Request $req, Response $res, array $args) : Response {
        return postReply($req, $res);
    });
    $this->put('/update/{reply_id}',function(Request $req, Response $res, array $args) : Response {
        return updateReply($req, $res, $args['reply_id']);
    });
    $this->delete('/delete/{ticket_id}',function(Request $req, Response $res, array $args) : Response {
        return deleteTicketReplies($req, $res, $args['ticket_id']);
    });
});