-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 02, 2023 at 07:44 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_ledger`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_transactions`
--

CREATE TABLE `tbl_transactions` (
  `id` bigint NOT NULL,
  `user` int NOT NULL DEFAULT '0',
  `type` tinyint NOT NULL DEFAULT '0',
  `amount` decimal(11,2) NOT NULL DEFAULT '0.00',
  `date` date NOT NULL,
  `remarks` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_transactions`
--

INSERT INTO `tbl_transactions` (`id`, `user`, `type`, `amount`, `date`, `remarks`, `created_at`, `updated_at`) VALUES
(1, 0, 0, '508.00', '2023-06-02', '', '2023-06-01 23:23:50', '2023-06-01 23:23:50'),
(2, 0, 0, '56.00', '2023-06-02', 'gdgrhrheh', '2023-06-01 23:43:29', '2023-06-01 23:43:58');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_transaction_logs`
--

CREATE TABLE `tbl_transaction_logs` (
  `id` bigint NOT NULL,
  `transaction_id` bigint NOT NULL,
  `remarks` text,
  `action_type` tinyint NOT NULL DEFAULT '0',
  `device` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_transaction_logs`
--

INSERT INTO `tbl_transaction_logs` (`id`, `transaction_id`, `remarks`, `action_type`, `device`, `created_at`) VALUES
(1, 1, '', 0, NULL, '2023-06-01 23:23:50'),
(2, 2, '', 0, 'OPPO F11 - CPH1911_11_F.20', '2023-06-01 23:43:29'),
(3, 2, 'gdgrhrheh', 1, 'OPPO F11 - CPH1911_11_F.20', '2023-06-01 23:43:58');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_transactions`
--
ALTER TABLE `tbl_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user` (`user`),
  ADD KEY `type` (`type`);

--
-- Indexes for table `tbl_transaction_logs`
--
ALTER TABLE `tbl_transaction_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transaction_id` (`transaction_id`),
  ADD KEY `action` (`action_type`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_transactions`
--
ALTER TABLE `tbl_transactions`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_transaction_logs`
--
ALTER TABLE `tbl_transaction_logs`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
