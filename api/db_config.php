<?php

// Database configuration
$host = 'localhost';
$dbName = 'db_ledger';
$username = 'root';
$password = '';

// Create a new PDO instance
try {
    $db = new PDO("mysql:host=$host;dbname=$dbName", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die('Database connection failed: ' . $e->getMessage());
}
?>
