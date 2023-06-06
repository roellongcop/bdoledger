<?php

class Connection
{
  public $host = 'localhost';
  public $dbName = 'db_ledger';
  public $username = 'root';
  public $password = '';

  public $connection;

  public function __construct()
  {
    try {
      $this->connection = new PDO("mysql:host={$this->host};dbname={$this->dbName}", $this->username, $this->password);
      $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
      die('Database connection failed: ' . $e->getMessage());
    }
  }
}