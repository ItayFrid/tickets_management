<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require '../vendor/autoload.php';
require '../src/config/db.php';
$app = new \Slim\App;

// Routes
require '../src/routes/tickets.php';
require '../src/routes/users.php';
require '../src/routes/categories.php';
require '../src/routes/replies.php';
require '../src/routes/auth.php';
$app->run();