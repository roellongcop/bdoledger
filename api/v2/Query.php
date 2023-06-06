<?php


class Query extends Connection
{
  public function getTransactions($limit = 100, $offset = 0)
  {
    $query = $this->connection->prepare('SELECT * FROM `tbl_transactions` ORDER BY `date` DESC, `id` DESC LIMIT :l OFFSET :o');
    $query->bindParam(':l', $limit, PDO::PARAM_INT);
    $query->bindParam(':o', $offset, PDO::PARAM_INT);
    $query->execute();
    return $query->fetchAll(PDO::FETCH_ASSOC);
  }

  public function getLogsByTransactionId($transaction_id)
  {
    $query = $this->connection->prepare('SELECT * FROM `tbl_transaction_logs` WHERE `transaction_id` = :transaction_id ORDER BY `id` DESC');
    $query->bindParam(':transaction_id', $transaction_id, PDO::PARAM_INT);
    $query->execute();
    return $query->fetchAll(PDO::FETCH_ASSOC);
  }

  public function getTotalTransactions()
  {
    $query = $this->connection->prepare('SELECT COUNT("*") as count FROM `tbl_transactions`');
    $query->execute();
    $count = $query->fetch(PDO::FETCH_ASSOC);

    return $count['count'] ?? 0;
  }

  public function getTotalTransactionsByUser()
  {
    $query = $this->connection->prepare('SELECT `user`, SUM( CASE WHEN `type` = 0 THEN `amount` WHEN `type` = 1 THEN -`amount` ELSE 0 END ) AS `total_amount` FROM `tbl_transactions` GROUP BY user');
    $query->execute();
    return $query->fetchAll(PDO::FETCH_ASSOC);
  }

  public function getTransactionLogs($limit = 100, $offset = 0)
  {
    $query = $this->connection->prepare('SELECT * FROM `tbl_transaction_logs` ORDER BY `id` DESC LIMIT :l OFFSET :o');
    $query->bindParam(':l', $limit, PDO::PARAM_INT);
    $query->bindParam(':o', $offset, PDO::PARAM_INT);
    $query->execute();
    return $query->fetchAll(PDO::FETCH_ASSOC);
  }

  public function getTotalTransactionLogs()
  {
    $query = $this->connection->prepare('SELECT COUNT("*") as count FROM `tbl_transaction_logs`');
    $query->execute();
    $count = $query->fetch(PDO::FETCH_ASSOC);
    return $count['count'] ?? 0;
  }


  public function insertLog($data, $transaction)
  {
    $remarks = "User: {$transaction['userLabel']}\nAction: {$transaction['typeLabel']}\nAmount: ₱{$transaction['amount']}\nDate: {$transaction['date']}\nRemarks: {$transaction['remarks']}";

    $query = $this->connection->prepare('INSERT INTO `tbl_transaction_logs` (`transaction_id`, `remarks`, `action_type`,`device`, `created_at`) VALUES (:transaction_id, :remarks, :action_type, :device, :created_at)');

    $query->bindParam(':transaction_id', $data['transaction_id'], PDO::PARAM_INT);
    $query->bindParam(':remarks', $remarks);
    $query->bindParam(':action_type', $data['action_type'], PDO::PARAM_INT);
    $query->bindParam(':device', $data['device']);
    $query->bindParam(':created_at', $data['created_at']);
    return $query->execute();
  }

  public function getTransactionById($id)
  {
    $query = $this->connection->prepare('SELECT * FROM `tbl_transactions` WHERE `id` = :id');
    $query->bindParam(':id', $id, PDO::PARAM_INT);
    $query->execute();
    return $query->fetch(PDO::FETCH_ASSOC);
  }

  public function insertTransaction($data)
  {
    $user = $data['user'] ?? ANNABELLE;
    $type = $data['type'] ?? ADD;
    $amount = $data['amount'] ?? 0;
    $date = date('Y-m-d', (isset($data['date']) ? strtotime($data['date']) : time()));
    $remarks = $data['remarks'] ?? '';
    $created = gmdate('Y-m-d H:i:s');

    $query = $this->connection->prepare('INSERT INTO `tbl_transactions` (`user`, `type`, `amount`, `date`, `remarks`, `created_at`, `updated_at`) VALUES (:user, :type, :amount, :date, :remarks, :created_at, :updated_at)');
    $query->bindParam(':user', $user, PDO::PARAM_INT);
    $query->bindParam(':type', $type, PDO::PARAM_INT);
    $query->bindParam(':amount', $amount);
    $query->bindParam(':date', $date);
    $query->bindParam(':remarks', $remarks);
    $query->bindParam(':created_at', $created);
    $query->bindParam(':updated_at', $created);
    $result = $query->execute();

    if ($result) {
      return $this->getTransactionById($this->connection->lastInsertId());
    }
  }

  public function updateTransaction($id, $data = [])
  {
    $user = $data['user'] ?? ANNABELLE;
    $type = $data['type'] ?? ADD;
    $amount = $data['amount'] ?? 0;
    $date = date('Y-m-d', (isset($data['date']) ? strtotime($data['date']) : time()));
    $remarks = $data['remarks'] ?? '';
    $created = gmdate('Y-m-d H:i:s');

    $query = $this->connection->prepare('UPDATE `tbl_transactions` SET `user` = :user, `type` = :type, `amount` = :amount, `date` = :date, `remarks` = :remarks, `updated_at` = :updated_at WHERE `id` = :id');

    $query->bindParam(':id', $id, PDO::PARAM_INT);
    $query->bindParam(':user', $user, PDO::PARAM_INT);
    $query->bindParam(':type', $type, PDO::PARAM_INT);
    $query->bindParam(':amount', $amount);
    $query->bindParam(':date', $date);
    $query->bindParam(':remarks', $remarks);
    $query->bindParam(':updated_at', $created);
    $result = $query->execute();

    if ($result) {
      return $this->getTransactionById($id);
    }
  }

  public function deleteTransaction($id)
  {
    $transaction = $this->getTransactionById($id);

    $query = $this->connection->prepare('DELETE FROM `tbl_transactions` WHERE `id` = :id');
    $query->bindParam(':id', $id, PDO::PARAM_INT);
    $result = $query->execute();

    if ($result) {
      return $transaction;
    }
  }
}