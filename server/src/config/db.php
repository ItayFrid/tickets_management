<?php

class db{
    private string $dbhost='localhost';
    private $dbuser='root';
    private $dbpass='';
    private $dbname='tickets_m';
    
    public function connect() : PDO{
        $mysql_connect_str = "mysql:host=$this->dbhost;dbname=$this->dbname;";
        $dbConnection = new PDO($mysql_connect_str, $this->dbuser, $this->dbpass);
        $dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $dbConnection;
    }
}
?>