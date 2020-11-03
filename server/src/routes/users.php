<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

include 'Middleware.php';

$app->group('/users', function () {
    $this->get('', function(Request $req, Response $res, array $args) : Response {
        return getAllUsers($req, $res);
    });
    $this->get('/details/{session_id}', function(Request $req, Response $res, array $args) : Response {
        return getUserDetail($req, $res, $args['session_id']);
    });
    $this->post('/login', function(Request $req, Response $res, array $args) : Response {
        return loginUser($req, $res);
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

/**
 * this function returns all users
 * @param Request $request
 * @param Response $response
 * @return Response
 */
function getAllUsers(Request $request, Response $response) : Response {
    $sql = "SELECT user_id, username, name, role FROM users";

    try {
        $db = new db();
        $db = $db->connect();
        $stmt = $db->query($sql);
        $users = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
    } catch(PDOException $e) {
        return $response->withJson(['error' => e.getMessage()]);
    }
    return $response->withJson($users);
}

/**
 * @param Request $request
 * @param Response $response
 * @return Response
 */
function getUserDetail(Request $request, Response $response, $session_id) : Response {
    session_id($session_id);
    session_start();
    if(isset($_SESSION)){
        $user = [
                "user_id" => $_SESSION['user_id'],
                "username" => $_SESSION['username'],
                "name"=> $_SESSION['name'],
                "role"=> $_SESSION['role'],
            ];
        return $response->withJson($user);
    }
    return $response->withStatus(404)->withJson(["error" => "user details not found"]);
}

/**
 * this function logs in user
 * @param Request $request
 * @param Response $response
 * @return Response
 */
function loginUser(Request $request, Response $response) : Response {
    $data = $request->getParsedBody();
    $username = strval($data['username'] ?? "");
    $password = strval($data['password'] ?? "");
    $sql = "SELECT username, password FROM users WHERE username='$username'";
    
    try {
        $db = new db();
        $db = $db->connect();
        $stmt = $db->query($sql);
        $user = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
    } catch(PDOException $e) {
        return $response->withJson(['error' => e.getMessage()]);
    }
    // TODO change login to sessions
    if(count($user) === 0) {
        return $response->withJson(['error' => "Login Failed"]);
    }
    else {
        $user = json_decode(json_encode($user[0]), true);
        if($username === $user['username'] && $password === $user['password']){
            // session_start();
            // $_SESSION["user_id"] = $user['user_id'];
            // $_SESSION["username"] = $user['username'];
            // $_SESSION["name"] = $user['name'];
            // $_SESSION["role"] = $user['role'];
            $newUser =[
                "user_id"=>$user['user_id'],
                "username"=>$user['username'],
                "name"=>$user['name'],
                "role"=>$user['role'],
            ];
            return $response->withJson($newUser);
            // return $response->withJson(["session_id" => session_id()]);
        }
        else
            return $response->withJson(['error' => 'username/password is wrong']);
    }
}

/**
 * this function post new user
 * @param Request $request
 * @param Response $response
 * @return Response
 */
function postUser(Request $request, Response $response) : Response {
    $data = $request->getParsedBody();
    $username = strval($data['username'] ?? "");
    $password = strval($data['password'] ?? "");
    $name = strval($data['name'] ?? "");
    $role = strval($data['role'] ?? "");
    $sql = "INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)";
    $check_username = "SELECT username from users where username='$username'";

    try{
        $db = new db();
        $db = $db->connect();

        //checks if username is available
        $username_stmt = $db->query($check_username);
        $user = $username_stmt->fetchAll(PDO::FETCH_OBJ);
        if(count($user) !== 0) {
            return $response->withJson(["text" => "username is taken"]);
        } else {
            $stmt = $db->prepare($sql);
            $stmt->execute([$username, $password, $name, $role]);
            $db = null;
            return $response->withJson(["text" => "New User Added"]);
        }
    } catch(PDOException $e){
        return $response->withJson(['error' => e.getMessage()]);
    }
}

/**
 * this function updates user
 * @param Request $request
 * @param Response $response
 * @param int $user_id
 * @return Response
 */
function updateUser(Request $request, Response $response, $user_id) : Response {
    $data = $request->getParsedBody();
    $username = strval($data['username'] ?? "" );
    $password = strval($data['password'] ?? "" );
    $name = strval($data['name'] ?? "" );
    $role = strval($data['role'] ?? "" );
    $sql = "UPDATE users SET username = ?, password = ?, name = ?, role = ? WHERE user_id = ?";

    try{
        $db = new db();
        $db = $db->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute([$username, $password, $name, $role, $user_id]);
        $db = null;
    } catch(PDOException $e){
        return $response->withJson(['error' => e.getMessage()]);
    }
    return $response->withJson(["text" =>"User updated", "user_id" => $user_id]);
}
/**
 * this function deletes user
 * @param Request $request
 * @param Response $response
 * @param int $user_id
 * @return Response
 */
function deleteUser(Request $request, Response $response, $user_id) : Response {
    $sql = "DELETE FROM users WHERE user_id = ?";

    try{
        $db = new db();
        $db = $db->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute([$user_id]);
        $db = null;
    } catch(PDOException $e){
        return $response->withJson(['error' => e.getMessage()]);
    }
    return $response->withJson(["text" => "User deleted", "user_id" => $user_id]);
}

/**
 * this function checks if username exist
 * @param Request $request
 * @param Response $response
 * @param string username
 * @return Response
 */
function checkUsername(Request $request, Response $response, $username) : Response {
    $check_username = "SELECT username from users where username ='$username'";

    try{
        $db = new db();
        $db = $db->connect();
        //checks if username is available
        $username_stmt = $db->query($check_username);
        $user = $username_stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
    } catch(PDOException $e){
        return $response->withJson(['error' => e.getMessage()]);
    }
    if(count($user) !== 0){
        return $response->withJson(["text" => "username is taken"]);
    } else {
        return $response->withJson(["text" => "username is available"]);
    }
}