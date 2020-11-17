<?php

require 'users.php';
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

$app->group('/users', function () {
    $this->get('', function(Request $req, Response $res, array $args) : Response {
        return getAllUsers($req, $res);
    });
    $this->post('/details', function(Request $req, Response $res, array $args) : Response {
        return getUserDetail($req, $res);
    });
    $this->post('/login', function(Request $req, Response $res, array $args) : Response {
        return loginUser($req, $res);
    })->add(new XssMiddleware());
    $this->post('/logout', function(Request $req, Response $res, array $args) : Response {
        return logoutUser($req, $res);
    })->add(new XssMiddleware());
    $this->post('/add', function(Request $req, Response $res, array $args) : Response {
        return postUser($req, $res);
    });
    $this->put('/update/{user_id}', function(Request $req, Response $res, array $args) : Response {
        return updateUser($req, $res, $args['user_id']);
    });
    $this->delete('/delete/{user_id}', function(Request $req, Response $res, array $args) : Response {
        return deleteUser($req, $res, $args['user_id']);
    });
    $this->get('/{username}', function(Request $req, Response $res, array $args) : Response {
        return checkUsername($req, $res, $args['username']);
    });
});