<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

$app->group('/categories', function () {
    $this->get('',function(Request $req,Response $res,array $args) : Response {
        return getAllCategories($req,$res);
    });
    $this->post('/add',function(Request $req,Response $res,array $args) : Response {
        return postCategory($req,$res);
    });
    $this->put('/update/{category_id}',function(Request $req,Response $res,array $args) : Response {
        return updateCategory($req,$res,$args['category_id']);
    });
    $this->delete('/delete/{category_id}',function(Request $req,Response $res,array $args) : Response {
        return deleteCategory($req,$res,$args['category_id']);
    });
});

/**
 * this function returns all categories
 * @param Request $request
 * @param Response $response
 * @return Response
 */
function getAllCategories(Request $request,Response $response) : Response {
    $sql = "SELECT * FROM categories";
    try {
        $db = new db();
        $db = $db->connect();

        $stmt = $db->query($sql);
        $categories = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        return $response->withJson($categories);
    } catch(PDOException $e) {
        return $response->withJson(["text" => e.getMessage()]);
    }
}

/**
 * this function posts new category
 * @param Request $request
 * @param Response $response
 * @return Response
 */
function postCategory(Request $request,Response $response) : Response {
    $data = $request->getParsedBody();
    $name = $data['name'];
    $sql = "INSERT INTO categories (name) VALUES (?)";

    try{
        $db = new db();
        $db = $db->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute([$name]);

        // Get Category ID
        $category_id = $db->lastInsertId();
        $db = null;

        return $response->withJson(["text" => "New Category Added", "category_id" => $category_id]);
    } catch(PDOException $e){
        return $response->withJson(["text" => e.getMessage()]);
    }
}

/**
 * this function updates category 
 * @param Request $request
 * @param Response $response
 * @param int $category_id
 * @return Response
 */
function updateCategory(Request $request,Response $response, $category_id) : Response {
    $data = $request->getParsedBody();
    $name = $data['name'];
    $sql = "UPDATE categories SET name = ?  WHERE category_id = ?";

    try{
        $db = new db();
        $db = $db->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute([$name,$category_id]);
        $db = null;

        return $response->withJson(["text" => "Category Updated", "category_id" => $category_id]);
    } catch(PDOException $e){
        return $response->withJson(["text" => e.getMessage()]);
    }
}

/**
 * 
 * @param Request $request
 * @param Response $response
 * @param int $category_id
 * @return Response
 */
function deleteCategory(Request $request,Response $response, $category_id) : Response {
    $sql = "DELETE FROM categories WHERE category_id = ?";

    try{
        $db = new db();
        $db = $db->connect();
        $stmt = $db->prepare($sql);
        $stmt->execute([$category_id]);
        $db = null;

        return $response->withJson(["text" => "Category deleted.", "category_id" => $category_id]);
    } catch(PDOException $e){
        return $response->withJson(["text" => e.getMessage()]);
    }
}