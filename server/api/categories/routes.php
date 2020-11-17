<?php
require 'categories.php';
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

$app->group('/categories', function () {
    $this->get('', function(Request $req, Response $res, array $args) : Response {
        return getAllCategories($req, $res);
    });
    $this->post('/add', function(Request $req, Response $res, array $args) : Response {
        return postCategory($req, $res);
    });
    $this->put('/update/{category_id}', function(Request $req, Response $res, array $args) : Response {
        return updateCategory($req, $res, $args['category_id']);
    });
    $this->delete('/delete/{category_id}', function(Request $req, Response $res, array $args) : Response {
        return deleteCategory($req, $res, $args['category_id']);
    });
});