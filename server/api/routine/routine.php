<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

function checkData(Request $request, Response $response) : Response{
    $data = $request->getParsedBody();
    $data['text'] = preg_replace("/[^a-zA-Z0-9!@#$^&*()~\s]/","",$data['text']);
    $data = strip_tags(strval($data['text'] ?? ""));
    return $response->withJson(['text' => $data]);
}

function usernameCheck(Request $request, Response $response) : Response{
    $data = $request->getParsedBody();
    $data['text'] = preg_replace("/[^a-zA-Z0-9_]/","",$data['text']);
    $data = htmlentities(strip_tags(strval( $data['text'] ?? "")));
    return $response->withJson(['text' => $data]);
}

function passwordCheck(Request $request, Response $response) : Response{
    $data = $request->getParsedBody();
    $data['text'] = preg_replace("/[^a-zA-Z0-9!@#$^&*()~]/","",$data['text']);
    $data = strip_tags(strval($data['text'] ?? ""));
    return $response->withJson(['text' => $data]);
}