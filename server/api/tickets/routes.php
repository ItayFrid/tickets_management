<?php
require 'tickets.php';
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

$app->group('/tickets', function () {
    $this->get('', function(Request $req, Response $res, array $args) : Response {
        return getAllTickets($req, $res);
    });
    $this->get('/{user_id}', function(Request $req, Response $res, array $args) : Response {
        return getAllUserTickets($req, $res, $args['user_id']);
    });
    $this->post('/add', function(Request $req, Response $res, array $args) : Response {
        return postTicket($req, $res);
    });
    $this->put('/update/{ticket_id}', function(Request $req, Response $res, array $args) : Response {
        return updateTicket($req, $res, $args['ticket_id']);
    });
    $this->delete('/delete/{ticket_id}', function(Request $req, Response $res, array $args) : Response {
        return deleteTicket($req, $res, $args['ticket_id']);
    });
});