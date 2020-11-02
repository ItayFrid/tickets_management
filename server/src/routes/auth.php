<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * this middleware checks for XSS in sent data
 * @param Request $request
 * @param Response $response
 * @param RequestHandler $next
 */
$middleware = function($request,$response,$next) {
    $data = $request->getParsedBody();
    $data['username'] = htmlentities(strip_tags(strval( $data['username'] ?? "")));
    $data['password'] = htmlentities(strip_tags(strval( $data['password'] ?? "")));
    $request = $request->withParsedBody($data);
    return $next($request,$response);
};

// auth user
$app->post('/api/auth', function(Request $request, Response $response){
    $data = $request->getParsedBody();
    $username =strval( $data['username'] ?? "");
    $password = $data['password'];
    $sql = "SELECT user_id,username,name,role FROM users WHERE username=$username";
    try{
        $db = new db();
        $db = $db->connect();

        $stmt = $db->query($sql);
        $user = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        return $response->withJson($user);
    } catch(PDOException $e){
        return $response->withJson(["text" => e.getMessage()]);
    }
})->add($middleware);