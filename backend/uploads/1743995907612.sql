-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 14, 2024 at 08:46 AM
-- Server version: 8.0.40-0ubuntu0.24.04.1
-- PHP Version: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `prorduction_client`
--

-- --------------------------------------------------------

--
-- Table structure for table `staff_roles`
--

CREATE TABLE `staff_roles` (
  `id` bigint UNSIGNED NOT NULL,
  `staff_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `staff_roles`
--

INSERT INTO `staff_roles` (`id`, `staff_type`, `created_at`, `updated_at`) VALUES
(1, 'Driver', '2024-06-27 05:27:18', '2024-06-27 05:27:18'),
(10, 'Warehouse Operative', '2024-07-11 10:35:51', '2024-07-11 10:35:51'),
(11, 'Haulage Driver', '2024-07-11 10:36:01', '2024-07-11 10:36:01'),
(12, 'Forklift Driver', '2024-07-11 10:36:05', '2024-07-11 10:36:05'),
(13, 'Bus Driver', '2024-07-11 10:36:11', '2024-07-11 10:36:11'),
(14, 'Coach Driver', '2024-07-11 10:36:14', '2024-07-11 10:36:14'),
(15, 'Machine Handler', '2024-07-11 10:36:33', '2024-07-11 10:36:33'),
(16, 'Shunter', '2024-07-11 10:36:41', '2024-07-11 10:36:41'),
(17, 'Cleaner', '2024-07-11 10:36:46', '2024-07-11 10:36:46'),
(18, 'Care Worker', '2024-07-11 10:36:49', '2024-07-11 10:36:49'),
(20, 'bus driver', '2024-09-09 11:17:33', '2024-09-09 11:17:33');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `staff_roles`
--
ALTER TABLE `staff_roles`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `staff_roles`
--
ALTER TABLE `staff_roles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
