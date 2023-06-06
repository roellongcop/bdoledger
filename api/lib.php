<?php

const ANNABELLE = 0;
const ROEL = 1;

const USERS = [
  ANNABELLE => 'Annabelle',
  ROEL => 'Roel',
];

const ADD = 0;
const MINUS = 1;

const ACTIONS = [
  ADD => 'Add',
  MINUS => 'Minus',
];

const CREATE = 0;
const UPDATE = 1;
const DELETE = 2;

function pluralize($count, $text)
{
  return $count . (($count == 1) ? " {$text}" : " {$text}s");
}
function asAgo($value)
{
  $today = new \DateTime('now');
  $datetime = new \DateTime($value);
  $interval = $today->diff($datetime);
  $suffix = ($interval->invert ? ' ago' : ' to go');

  if ($v = $interval->y >= 1)
    return pluralize($interval->y, 'year') . $suffix;

  if ($v = $interval->m >= 1)
    return pluralize($interval->m, 'month') . $suffix;

  if ($v = $interval->d >= 28)
    return pluralize(4, 'week') . $suffix;

  if ($v = $interval->d >= 21)
    return pluralize(3, 'week') . $suffix;

  if ($v = $interval->d >= 14)
    return pluralize(2, 'week') . $suffix;

  if ($v = $interval->d >= 7)
    return pluralize(1, 'week') . $suffix;

  if ($v = $interval->d >= 1)
    return pluralize($interval->d, 'day') . $suffix;

  if ($v = $interval->h >= 1)
    return pluralize($interval->h, 'hour') . $suffix;

  if ($v = $interval->i >= 1)
    return pluralize($interval->i, 'minute') . $suffix;

  if ($interval->s == 0)
    return 'Just now';

  return pluralize($interval->s, 'second') . $suffix;
}

function formatNumber($num)
{
  return $num != floor($num) ? $num : intval($num);
  ;
}

function asDateToTimezone($date = '', $format = 'F d, Y h:i:s A', $timezone = "Asia/Manila")
{

  $date = ($date) ? $date : date('Y-m-d h:i:s A');

  $usersTimezone = new \DateTimeZone($timezone);
  $l10nDate = new \DateTime();
  $l10nDate->setTimestamp(strtotime($date));
  $l10nDate->setTimeZone($usersTimezone);

  return $l10nDate->format($format);
}

function formatData($data)
{
  if (!$data) {
    return;
  }
  if (isset($data['amount'])) {
    $data['amount'] = formatNumber($data['amount']);
  }
  if (isset($data['created_at'])) {
    $data['ago'] = asAgo($data['created_at']);
    $data['createdAt'] = asDateToTimezone($data['created_at']);

  }
  if (isset($data['date'])) {
    $data['date'] = $data['date'] ? date('m/d/Y', strtotime($data['date'])) : '';
  }

  if (isset($data['user'])) {
    $data['user'] = (int) $data['user'];
    $data['userLabel'] = USERS[$data['user']];
  }

  if (isset($data['type'])) {
    $data['type'] = (int) $data['type'];
    $data['typeLabel'] = ACTIONS[$data['type']];
  }

  if (isset($data['action_type'])) {
    $data['action_type'] = (int) $data['action_type'];
  }

  return $data;
}

function formatTotal($data)
{
  if (!$data) {
    return;
  }

  $data['user'] = USERS[$data['user']] ?? '';
  return $data;
}



function transactionData($db, $limit = 50, $offset = 0)
{
  $transactions = getTransactions($db, $limit, $offset);

  $transactions = array_map(function ($transaction) use ($db) {
    $logs = getLogsByTransactionId($db, $transaction['id']);
    $transaction['logs'] = $logs ? array_map('formatData', $logs) : [];
    return $transaction;
  }, $transactions);


  $totals = getTotalTransactionsByUser($db);

  return [
    'totalTransactions' => getTotalTransactions($db),
    'totalAnnabelle' => formatNumber($totals['ANNABELLE']),
    'totalRoel' => formatNumber($totals['ROEL']),
    'total' => formatNumber($totals['TOTAL']),
    'transactions' => array_map('formatData', $transactions),
  ];
}

function transactionLogsData($db, $limit = 50, $offset = 0)
{
  $logs = getTransactionLogs($db, $limit, $offset);

  $formattedLogs = array_map('formatData', $logs);

  foreach ($formattedLogs as &$log) {
    $transaction = formatData(getTransactionById($db, $log['transaction_id']));
    if ($transaction) {
      $logs = getLogsByTransactionId($db, $transaction['id']);
      $transaction['logs'] = $logs ? array_map('formatData', $logs) : [];

      $log['transaction'] = $transaction;
    }
  }

  return [
    'totalLogs' => getTotalTransactionLogs($db),
    'logs' => $formattedLogs,
  ];
}