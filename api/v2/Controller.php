<?php

require 'Connection.php';
require 'Query.php';
require 'Helper.php';

// Set headers to allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');


$query = new Query();

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
    $transaction = $query->getTransactionById($id);

    if (!$transaction) {
      echo json_encode([
        'status' => false,
        'data' => ['message' => 'Data Not Found']
      ]);
      die;
    }

    $logs = $query->getLogsByTransactionId($id);
    $transaction['logs'] = $logs ? array_map(['Helper', 'formatData'], $logs) : [];
  }

  switch ($method) {
    case 'GET':
      if ($id) {
        if ($transaction) {
          echo json_encode([
            'status' => true,
            'data' => Helper::formatData($transaction)
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
            'data' => Helper::transactionData($query, $_GET['limit'] ?? 100, $_GET['offset'] ?? 0)
          ]);
        } else {
          echo json_encode([
            'status' => true,
            'data' => Helper::transactionLogsData($query, $_GET['limit'] ?? 100, $_GET['offset'] ?? 0)
          ]);
        }
      }
      break;

    // CREATE
    case 'POST':
      $action = $_GET['action'] ?? 'create';

      if ($action == 'create') {
        if (($result = $query->insertTransaction($_POST)) != null) {
          $query->insertLog([
            'transaction_id' => $result['id'],
            'action_type' => Helper::CREATE,
            'created_at' => $result['created_at'],
            'device' => $_POST['device'] ?? '',
          ], Helper::formatData($result));

          echo json_encode([
            'status' => true,
            'data' => Helper::transactionData($query)
          ]);
        } else {
          echo json_encode([
            'status' => false,
            'data' => ['message' => 'Inserting failed'],
          ]);
        }
      } elseif ($action == 'update') {
        if (($result = $query->updateTransaction($id, $_POST)) != null) {
          $query->insertLog([
            'transaction_id' => $id,
            'action_type' => Helper::UPDATE,
            'created_at' => $result['created_at'],
            'device' => $_POST['device'] ?? '',
          ], Helper::formatData($result));

          echo json_encode([
            'status' => true,
            'data' => Helper::transactionData($query)
          ]);
        } else {
          echo json_encode([
            'status' => false,
            'data' => ['message' => 'Updating failed']
          ]);
        }
      } elseif ($action == 'delete') {
        if (($result = $query->deleteTransaction($id)) != null) {
          $query->insertLog([
            'transaction_id' => $id,
            'action_type' => Helper::DELETE,
            'created_at' => $result['created_at'],
            'device' => $_POST['device'] ?? '',
          ], Helper::formatData($result));

          echo json_encode([
            'status' => true,
            'data' => Helper::transactionData($query)
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