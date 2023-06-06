<?php
class Helper
{

  const ANNABELLE = 0;
  const ROEL = 1;

  const USERS = [
    0 => 'Annabelle',
    1 => 'Roel',
  ];

  const ADD = 0;
  const MINUS = 1;

  const ACTIONS = [
    0 => 'Add',
    1 => 'Minus',
  ];

  const CREATE = 0;
  const UPDATE = 1;
  const DELETE = 2;

  public static function pluralize($count, $text)
  {
    return $count . (($count == 1) ? " {$text}" : " {$text}s");
  }
  public static function asAgo($value)
  {
    $today = new \DateTime('now');
    $datetime = new \DateTime($value);
    $interval = $today->diff($datetime);
    $suffix = ($interval->invert ? ' ago' : ' to go');

    if ($v = $interval->y >= 1)
      return self::pluralize($interval->y, 'year') . $suffix;

    if ($v = $interval->m >= 1)
      return self::pluralize($interval->m, 'month') . $suffix;

    if ($v = $interval->d >= 28)
      return self::pluralize(4, 'week') . $suffix;

    if ($v = $interval->d >= 21)
      return self::pluralize(3, 'week') . $suffix;

    if ($v = $interval->d >= 14)
      return self::pluralize(2, 'week') . $suffix;

    if ($v = $interval->d >= 7)
      return self::pluralize(1, 'week') . $suffix;

    if ($v = $interval->d >= 1)
      return self::pluralize($interval->d, 'day') . $suffix;

    if ($v = $interval->h >= 1)
      return self::pluralize($interval->h, 'hour') . $suffix;

    if ($v = $interval->i >= 1)
      return self::pluralize($interval->i, 'minute') . $suffix;

    if ($interval->s == 0)
      return 'Just now';

    return self::pluralize($interval->s, 'second') . $suffix;
  }

  public static function formatNumber($num)
  {
    return $num != floor($num) ? $num : intval($num);
  }

  public static function asDateToTimezone($date = '', $format = 'F d, Y h:i:s A', $timezone = "Asia/Manila")
  {
    $date = ($date) ? $date : date('Y-m-d h:i:s A');

    $usersTimezone = new \DateTimeZone($timezone);
    $l10nDate = new \DateTime();
    $l10nDate->setTimestamp(strtotime($date));
    $l10nDate->setTimeZone($usersTimezone);

    return $l10nDate->format($format);
  }

  public static function formatData($data)
  {
    if (!$data) {
      return;
    }
    if (isset($data['amount'])) {
      $data['amount'] = self::formatNumber($data['amount']);
    }
    if (isset($data['created_at'])) {
      $data['ago'] = self::asAgo($data['created_at']);
      $data['createdAt'] = self::asDateToTimezone($data['created_at']);

    }
    if (isset($data['date'])) {
      $data['date'] = $data['date'] ? date('m/d/Y', strtotime($data['date'])) : '';
    }

    if (isset($data['user'])) {
      $data['user'] = (int) $data['user'];
      $data['userLabel'] = self::USERS[$data['user']];
    }

    if (isset($data['type'])) {
      $data['type'] = (int) $data['type'];
      $data['typeLabel'] = self::ACTIONS[$data['type']];
    }

    if (isset($data['action_type'])) {
      $data['action_type'] = (int) $data['action_type'];
    }

    return $data;
  }

  public static function formatTotal($data)
  {
    if (!$data) {
      return;
    }

    $data['user'] = self::USERS[$data['user']] ?? '';
    return $data;
  }



  public static function transactionData($query, $limit = 50, $offset = 0)
  {
    $transactions = $query->getTransactions($limit, $offset);

    $transactions = array_map(function ($transaction) use ($query) {
      $logs = $query->getLogsByTransactionId($transaction['id']);
      $transaction['logs'] = $logs ? array_map(['Helper', 'formatData'], $logs) : [];
      return $transaction;
    }, $transactions);


    $totals = $query->getTotalTransactionsByUser();

    $newTotals = array_combine(
      array_column($totals, 'user'),
      array_column($totals, 'total_amount')
    );

    list($totalAnnabelle, $totalRoel) = [$newTotals[self::ANNABELLE] ?? 0, $newTotals[self::ROEL] ?? 0];

    return [
      'totalTransactions' => $query->getTotalTransactions(),
      'totalAnnabelle' => self::formatNumber($totalAnnabelle),
      'totalRoel' => self::formatNumber($totalRoel),
      'total' => self::formatNumber(array_sum([$totalAnnabelle, $totalRoel])),
      'transactions' => array_map(['Helper', 'formatData'], $transactions),
    ];
  }

  public static function transactionLogsData($query, $limit = 50, $offset = 0)
  {
    $logs = $query->getTransactionLogs($limit, $offset);

    $formattedLogs = array_map(['Helper', 'formatData'], $logs);

    foreach ($formattedLogs as &$log) {
      $transaction = self::formatData($query->getTransactionById($log['transaction_id']));
      if ($transaction) {
        $logs = $query->getLogsByTransactionId($transaction['id']);
        $transaction['logs'] = $logs ? array_map(['Helper', 'formatData'], $logs) : [];

        $log['transaction'] = $transaction;
      }
    }

    return [
      'totalLogs' => $query->getTotalTransactionLogs(),
      'logs' => $formattedLogs,
    ];
  }
}