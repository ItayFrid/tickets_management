<?php
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Psr7\Response;

class XssMiddleware {
    public function __invoke($request,$response, $next)
    {
        $data = $request->getParsedBody();
        $data['username'] = htmlentities(strip_tags(strval( $data['username'] ?? "")));
        $data['password'] = htmlentities(strip_tags(strval( $data['password'] ?? "")));
        $request = $request->withParsedBody($data);
        return $next($request,$response);
    }
}