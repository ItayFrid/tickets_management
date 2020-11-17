<?php
include 'routine.php';
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

$app->group('/checks', function () {
    $this->post('/input', function(Request $req, Response $res, array $args) : Response {
        return checkData($req, $res);
    });
    $this->post('/username', function(Request $req, Response $res, array $args) : Response {
        return usernameCheck($req, $res);
    });
    $this->post('/password', function(Request $req, Response $res, array $args) : Response {
        return passwordCheck($req, $res);
    });
});