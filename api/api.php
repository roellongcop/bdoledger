<?php

require 'db_config.php';
require 'query.php';
require 'lib.php';

// Set headers to allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');



// Handle the request method and execute the appropriate action
$method = $_SERVER['REQUEST_METHOD'];

try {
  $transaction = [];
  $id = $_GET['id'] ?? 0;
  $table = $_GET['table'] ?? 'transactions';
  $accessToken = $_GET['access-token'] ?? '';

  if (!$accessToken) {
    echo json_encode([
      'status' => false,
      'data' => ['message' => 'No access token provided']
    ]);
    die;
  }

  if ($accessToken != 'access_token-developer') {
    echo json_encode([
      'status' => false,
      'data' => ['message' => 'Invalid access token provided']
    ]);
    die;
  }

  if ($id && $table == 'transactions') {
    $transaction = getTransactionById($db, $id);

    if (!$transaction) {
      echo json_encode([
        'status' => false,
        'data' => ['message' => 'Data Not Found']
      ]);
      die;
    }

    $logs = getLogsByTransactionId($db, $id);
    $transaction['logs'] = $logs ? array_map('formatData', $logs) : [];
  }


  switch ($method) {
    case 'GET':
      if ($id) {
        if ($transaction) {
          echo json_encode([
            'status' => true,
            'data' => formatData($transaction)
          ]);
        } else {
          echo json_encode([
            'status' => false,
            'message' => 'Data not found'
          ]);
        }
      } else {
        if ($table == 'transactions') {
          echo json_encode([
            'status' => true,
            'data' => transactionData($db, $_GET['limit'] ?? 100, $_GET['offset'] ?? 0)
          ]);
        } else {
          echo json_encode([
            'status' => true,
            'data' => transactionLogsData($db, $_GET['limit'] ?? 100, $_GET['offset'] ?? 0)
          ]);
        }
      }
      break;

    // CREATE
    case 'POST':
      $action = $_GET['action'] ?? 'create';

      if ($action == 'create') {
        if (($result = insertTransaction($db, $_POST)) != null) {
          insertLog($db, [
            'transaction_id' => $result['id'],
            'action_type' => CREATE,
            'created_at' => $result['created_at'],
            'device' => $_POST['device'] ?? '',
          ], formatData($result));

          echo json_encode([
            'status' => true,
            'data' => transactionData($db)
          ]);
        } else {
          echo json_encode([
            'status' => false,
            'data' => ['message' => 'Inserting failed'],
          ]);
        }
      } elseif ($action == 'update') {
        if (($result = updateTransaction($db, $id, $_POST)) != null) {
          insertLog($db, [
            'transaction_id' => $id,
            'action_type' => UPDATE,
            'created_at' => $result['created_at'],
            'device' => $_POST['device'] ?? '',
          ], formatData($result));

          echo json_encode([
            'status' => true,
            'data' => transactionData($db)
          ]);
        } else {
          echo json_encode([
            'status' => false,
            'data' => ['message' => 'Updating failed']
          ]);
        }
      } elseif ($action == 'delete') {
        if (($result = deleteTransaction($db, $id)) != null) {
          insertLog($db, [
            'transaction_id' => $id,
            'action_type' => DELETE,
            'created_at' => $result['created_at'],
            'device' => $_POST['device'] ?? '',
          ], formatData($result));

          echo json_encode([
            'status' => true,
            'data' => transactionData($db)
          ]);
        } else {
          echo json_encode([
            'status' => false,
            'data' => ['message' => 'Deleting Failed']
          ]);
        }
      }
      break;

    default:
      echo json_encode([
        'status' => false,
        'data' => ['message' => 'Invalid Request Method.']
      ]);
      break;
  }
} catch (\Throwable $th) {
  echo json_encode([
    'status' => false,
    'data' => ['message' => $th->getMessage()]
  ]);
}