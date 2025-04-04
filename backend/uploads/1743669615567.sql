-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 14, 2024 at 06:21 AM
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
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `role_id` bigint UNSIGNED DEFAULT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reg_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `funding_limit` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `day_start_time` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `day_end_time` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facebook` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linkedin` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `twitter` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Pending',
  `file` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `driver_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `first_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `driver_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dob` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ni_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `roleType` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `licenceType` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `licenceNumber` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `licenceExpiry` date DEFAULT NULL,
  `cpcNumber` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cpcExpiry` date DEFAULT NULL,
  `tachoCard` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tachoNumber` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `drivingConvictions` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '51.505',
  `longitude` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '-0.09',
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `break_time` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `middleName` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `knownAs` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employeeNumber` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `startDateExpected` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jobTitle` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nationalInsuranceLetter` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `addressLine1` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `addressLine2` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `taxCode` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `basisNonCumulative` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `studentLoan` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postGraduateLoan` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employmentType` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `partnershipTradingName` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trustName` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `starterForm` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyTradingName` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companiesHouseRegistrationNumber` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentFrequency` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `county` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobile` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postCode` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accountType` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `utrAppliedOn` date DEFAULT NULL,
  `employmentStartDate` date DEFAULT NULL,
  `employmentFirstPayDate` date DEFAULT NULL,
  `vatReverseCharge` tinyint(1) DEFAULT '0',
  `contactStatusId` bigint DEFAULT '35',
  `vatRegistrationNumber` bigint DEFAULT NULL,
  `contactTypeId` bigint DEFAULT '22',
  `utrNumber` bigint DEFAULT NULL,
  `partnershipUtrNumber` bigint DEFAULT NULL,
  `reasonForStopPayrollId` bigint DEFAULT NULL,
  `newBusinessAdministratorId` bigint DEFAULT '349536',
  `accountManagerId` bigint DEFAULT '349536',
  `externalReference` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'C9-Attendly',
  `peopleId` bigint DEFAULT NULL,
  `companyId` bigint DEFAULT NULL,
  `title` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `surname` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `employment_start_date` date DEFAULT NULL,
  `employment_first_pay_date` date DEFAULT NULL,
  `nationality` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `marginType` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `passport_number` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `starter_form` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `works_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `new_business_administrator_id` bigint DEFAULT '349536',
  `account_manager_id` bigint DEFAULT '349536',
  `address_line1` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `address_line2` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `post_code` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stop_payroll` tinyint(1) DEFAULT '0',
  `enable_login` tinyint(1) DEFAULT '0',
  `stopPayroll` tinyint(1) DEFAULT '0',
  `access_privileges` json DEFAULT NULL,
  `country` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `businessType` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT ',30Sole Trader',
  `enableLogin` tinyint(1) DEFAULT '1',
  `creditIsoCurrencyCode` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expense_type` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rejoinDate` date DEFAULT NULL,
  `margin` decimal(8,2) DEFAULT NULL,
  `margin_type` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `margin_free_periods` bigint DEFAULT NULL,
  `holiday_pay_type` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `se_PAYE` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `off_payroll_worker` tinyint(1) DEFAULT '0',
  `restrict_expenses` tinyint(1) DEFAULT '0',
  `apply_custom_SE_tax_deduction` tinyint(1) DEFAULT '0',
  `customerId` int DEFAULT NULL,
  `paymentTerms` int DEFAULT NULL,
  `fax` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoiceModeToSendToCustomer` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoiceToBeSentAs` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoiceEmailSettings` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `restrictGhostInvoicesSent` tinyint(1) DEFAULT NULL,
  `vatOverride` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoiceGroupedByLocation` tinyint(1) DEFAULT NULL,
  `invoicePerLocation` tinyint(1) DEFAULT NULL,
  `licence_endorsement` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `right_to_work_uk` tinyint(1) DEFAULT NULL,
  `dbs_check` tinyint(1) DEFAULT NULL,
  `opt_out_of_pension` tinyint(1) DEFAULT NULL,
  `medical_condition` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `driving_licence_doc` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `passport_doc` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cpc_doc` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tacho_doc` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `proof_of_address_doc` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `xero_contact_id` int DEFAULT NULL,
  `po_setting` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `passportNumber` varchar(9) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invitation_id` int DEFAULT NULL,
  `mda_status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role_id`, `name`, `company_name`, `user_name`, `reg_number`, `slug`, `email`, `email_verified_at`, `password`, `phone`, `role`, `image`, `address`, `funding_limit`, `description`, `day_start_time`, `day_end_time`, `website`, `facebook`, `linkedin`, `twitter`, `status`, `file`, `driver_id`, `first_name`, `last_name`, `gender`, `driver_type`, `dob`, `ni_number`, `roleType`, `licenceType`, `licenceNumber`, `licenceExpiry`, `cpcNumber`, `cpcExpiry`, `tachoCard`, `tachoNumber`, `drivingConvictions`, `latitude`, `longitude`, `remember_token`, `created_at`, `updated_at`, `break_time`, `middleName`, `knownAs`, `employeeNumber`, `startDateExpected`, `jobTitle`, `nationalInsuranceLetter`, `addressLine1`, `addressLine2`, `taxCode`, `basisNonCumulative`, `studentLoan`, `postGraduateLoan`, `employmentType`, `partnershipTradingName`, `trustName`, `starterForm`, `companyTradingName`, `companiesHouseRegistrationNumber`, `city`, `paymentFrequency`, `county`, `mobile`, `postCode`, `accountType`, `utrAppliedOn`, `employmentStartDate`, `employmentFirstPayDate`, `vatReverseCharge`, `contactStatusId`, `vatRegistrationNumber`, `contactTypeId`, `utrNumber`, `partnershipUtrNumber`, `reasonForStopPayrollId`, `newBusinessAdministratorId`, `accountManagerId`, `externalReference`, `peopleId`, `companyId`, `title`, `surname`, `date_of_birth`, `employment_start_date`, `employment_first_pay_date`, `nationality`, `marginType`, `passport_number`, `starter_form`, `works_number`, `new_business_administrator_id`, `account_manager_id`, `address_line1`, `address_line2`, `post_code`, `stop_payroll`, `enable_login`, `stopPayroll`, `access_privileges`, `country`, `businessType`, `enableLogin`, `creditIsoCurrencyCode`, `expense_type`, `rejoinDate`, `margin`, `margin_type`, `margin_free_periods`, `holiday_pay_type`, `se_PAYE`, `off_payroll_worker`, `restrict_expenses`, `apply_custom_SE_tax_deduction`, `customerId`, `paymentTerms`, `fax`, `invoiceModeToSendToCustomer`, `invoiceToBeSentAs`, `invoiceEmailSettings`, `restrictGhostInvoicesSent`, `vatOverride`, `invoiceGroupedByLocation`, `invoicePerLocation`, `licence_endorsement`, `right_to_work_uk`, `dbs_check`, `opt_out_of_pension`, `medical_condition`, `driving_licence_doc`, `passport_doc`, `cpc_doc`, `tacho_doc`, `proof_of_address_doc`, `xero_contact_id`, `po_setting`, `passportNumber`, `invitation_id`, `mda_status`) VALUES
(709, 1, 'Caolan Davey ADM', NULL, NULL, NULL, 'caolan-davey-adm', 'caolan.davey@c9-group.co.uk', NULL, '$2y$10$/UElyfrTGJRFd7RoKqrZKusQ89hVY8pljt98KgzzCoa1ZW/XDE5Mm', '07432205558', 'admin', '2024090909522852.jpeg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Approved', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '51.505', '-0.09', NULL, '2024-09-09 09:28:52', '2024-09-15 21:40:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 450, 450, 450, 450, 450, 450, 'C9-Attendly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 290019, 290019, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, ',30Sole Trader', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(926, 1, 'System Admin', NULL, 'admin', NULL, 'admin', 'Sam.wharfe@C9-group.co.uk', '2024-10-02 12:09:03', '$2y$10$pBS4h/Cmv2y0zp5Dv8cGi.pfjp8MTTuox4XPF22erEqLq0PIBnQ7W', '016000000', 'admin', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Approved', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '51.505', '-0.09', NULL, '2024-10-02 12:09:03', '2024-10-02 12:09:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 35, NULL, 22, NULL, NULL, NULL, 349536, 349536, 'C9-Attendly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 349536, 349536, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, ',30Sole Trader', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(927, 1, 'Administrator Hayatunnabi Nabil', NULL, 'imhayatunnabi', NULL, 'imhayatunnabi.pen', 'imhayatunnabi.pen@gmail.com', '2024-10-02 12:09:03', '$2y$10$xrEAPjhunJiEYdJYH9j4eOzN/TiWpV2mjO/F9LDo.IaFo2FeDEm5a', '01878005537', 'admin', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Approved', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '51.505', '-0.09', NULL, '2024-10-02 12:09:03', '2024-10-02 12:09:03', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 35, NULL, 22, NULL, NULL, NULL, 349536, 349536, 'C9-Attendly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 349536, 349536, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, ',30Sole Trader', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(1020, 1, 'Amy Hollier', NULL, NULL, NULL, 'amy-hollier-2024100710422542', 'amy.hollier@c9-recruitment.com', NULL, '$2y$10$J9Av8MMmwQhocQx7OPqA7.wv/Z9V2PpLgL3kCBD4uKJ3o1IUWnFui', '07955295078', 'admin', '2024100710422542.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Approved', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '51.505', '-0.09', NULL, '2024-10-07 10:25:43', '2024-10-07 10:35:23', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 35, NULL, 22, NULL, NULL, NULL, 349536, 349536, 'C9-Attendly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 349536, 349536, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, ',30Sole Trader', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_driver_id_unique` (`driver_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1049;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
