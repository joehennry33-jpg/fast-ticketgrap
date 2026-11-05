-- =====================================================================
-- KICKPASS KENYA - FOOTBALL TICKET BOOKING & EVENT MANAGEMENT SYSTEM
-- Relational Database Schema (MySQL 8.0+ / MariaDB compatible for XAMPP)
-- Flagship Event: Ajax Amsterdam vs Bayern Munich - Talanta Stadium Nairobi
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `kickpass_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `kickpass_db`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `ticket_verifications`;
DROP TABLE IF EXISTS `payment_transactions`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `tickets`;
DROP TABLE IF EXISTS `booking_items`;
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `ticket_categories`;
DROP TABLE IF EXISTS `events`;
DROP TABLE IF EXISTS `teams`;
DROP TABLE IF EXISTS `administrators`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `notifications`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. USERS TABLE
CREATE TABLE `users` (
  `id` VARCHAR(36) PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `phone` VARCHAR(30) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `id_number` VARCHAR(50) DEFAULT NULL,
  `nationality` VARCHAR(50) DEFAULT 'Kenyan',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. ADMINISTRATORS TABLE
CREATE TABLE `administrators` (
  `id` VARCHAR(36) PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('SUPER_ADMIN', 'EVENT_MANAGER', 'GATE_STEWARD', 'FINANCE_AUDITOR') NOT NULL DEFAULT 'EVENT_MANAGER',
  `last_login_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TEAMS TABLE
CREATE TABLE `teams` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `short_name` VARCHAR(10) NOT NULL,
  `country` VARCHAR(80) NOT NULL,
  `founded_year` INT DEFAULT NULL,
  `crest_url` TEXT NOT NULL,
  `jersey_primary_color` VARCHAR(20) DEFAULT '#FFFFFF',
  `jersey_secondary_color` VARCHAR(20) DEFAULT '#D2122E',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. EVENTS TABLE
CREATE TABLE `events` (
  `id` VARCHAR(36) PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL UNIQUE,
  `home_team_id` VARCHAR(36) NOT NULL,
  `away_team_id` VARCHAR(36) NOT NULL,
  `event_date` DATETIME NOT NULL,
  `kickoff_time` VARCHAR(20) NOT NULL,
  `gates_open_time` VARCHAR(20) NOT NULL,
  `venue_name` VARCHAR(150) NOT NULL,
  `venue_city` VARCHAR(100) NOT NULL DEFAULT 'Nairobi',
  `venue_country` VARCHAR(100) NOT NULL DEFAULT 'Kenya',
  `stadium_capacity` INT NOT NULL DEFAULT 60000,
  `status` ENUM('UPCOMING', 'CONFIRMED', 'POSTPONED', 'CANCELLED', 'COMPLETED') DEFAULT 'UPCOMING',
  `is_flagship` TINYINT(1) DEFAULT 1,
  `disclaimer_text` TEXT DEFAULT NULL,
  `banner_image_url` TEXT DEFAULT NULL,
  `description` TEXT NOT NULL,
  `rules_and_entry` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`home_team_id`) REFERENCES `teams`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`away_team_id`) REFERENCES `teams`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. TICKET_CATEGORIES TABLE
CREATE TABLE `ticket_categories` (
  `id` VARCHAR(36) PRIMARY KEY,
  `event_id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `code` VARCHAR(30) NOT NULL,
  `price_kes` DECIMAL(10, 2) NOT NULL,
  `total_quota` INT NOT NULL,
  `available_quota` INT NOT NULL,
  `reserved_quota` INT NOT NULL DEFAULT 0,
  `gate_designation` VARCHAR(100) NOT NULL,
  `seating_area` VARCHAR(150) NOT NULL,
  `description` TEXT NOT NULL,
  `perks` TEXT DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `sort_order` INT DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE CASCADE,
  INDEX `idx_tc_event` (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. BOOKINGS TABLE
CREATE TABLE `bookings` (
  `id` VARCHAR(36) PRIMARY KEY,
  `booking_reference` VARCHAR(40) NOT NULL UNIQUE,
  `user_id` VARCHAR(36) NULL,
  `event_id` VARCHAR(36) NOT NULL,
  `customer_name` VARCHAR(150) NOT NULL,
  `customer_email` VARCHAR(150) NOT NULL,
  `customer_phone` VARCHAR(30) NOT NULL,
  `total_tickets` INT NOT NULL,
  `subtotal_kes` DECIMAL(12, 2) NOT NULL,
  `service_fee_kes` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `total_amount_kes` DECIMAL(12, 2) NOT NULL,
  `booking_status` ENUM('PENDING', 'PAYMENT_PENDING', 'CONFIRMED', 'CANCELLED', 'EXPIRED') DEFAULT 'PENDING',
  `payment_status` ENUM('UNPAID', 'PROCESSING', 'PAID', 'FAILED', 'REFUNDED') DEFAULT 'UNPAID',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE RESTRICT,
  INDEX `idx_booking_ref` (`booking_reference`),
  INDEX `idx_booking_email` (`customer_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. BOOKING_ITEMS TABLE
CREATE TABLE `booking_items` (
  `id` VARCHAR(36) PRIMARY KEY,
  `booking_id` VARCHAR(36) NOT NULL,
  `category_id` VARCHAR(36) NOT NULL,
  `quantity` INT NOT NULL,
  `unit_price_kes` DECIMAL(10, 2) NOT NULL,
  `subtotal_kes` DECIMAL(12, 2) NOT NULL,
  FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `ticket_categories`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. TICKETS TABLE
CREATE TABLE `tickets` (
  `id` VARCHAR(36) PRIMARY KEY,
  `ticket_number` VARCHAR(50) NOT NULL UNIQUE,
  `booking_id` VARCHAR(36) NOT NULL,
  `category_id` VARCHAR(36) NOT NULL,
  `event_id` VARCHAR(36) NOT NULL,
  `attendee_name` VARCHAR(150) NOT NULL,
  `attendee_id_number` VARCHAR(50) DEFAULT NULL,
  `seat_identifier` VARCHAR(50) DEFAULT 'Open Seating within Tier',
  `gate_entrance` VARCHAR(80) NOT NULL,
  `qr_code_signature` VARCHAR(255) NOT NULL,
  `security_hash` VARCHAR(64) NOT NULL,
  `status` ENUM('ISSUED', 'CHECKED_IN', 'REVOKED', 'CANCELLED') DEFAULT 'ISSUED',
  `checked_in_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `ticket_categories`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE RESTRICT,
  INDEX `idx_ticket_number` (`ticket_number`),
  INDEX `idx_ticket_hash` (`security_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. PAYMENTS TABLE
CREATE TABLE `payments` (
  `id` VARCHAR(36) PRIMARY KEY,
  `booking_id` VARCHAR(36) NOT NULL,
  `payment_method` ENUM('MPESA_STK_PUSH', 'MPESA_PAYBILL', 'CARD_PAYMENT', 'BANK_TRANSFER') NOT NULL,
  `amount_kes` DECIMAL(12, 2) NOT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'KES',
  `mpesa_phone_number` VARCHAR(30) DEFAULT NULL,
  `mpesa_receipt_number` VARCHAR(60) DEFAULT NULL UNIQUE,
  `checkout_request_id` VARCHAR(100) DEFAULT NULL,
  `merchant_request_id` VARCHAR(100) DEFAULT NULL,
  `card_last_four` VARCHAR(4) DEFAULT NULL,
  `status` ENUM('INITIATED', 'PENDING_PIN', 'COMPLETED', 'FAILED', 'TIMED_OUT', 'REJECTED') DEFAULT 'INITIATED',
  `raw_gateway_response` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE CASCADE,
  INDEX `idx_mpesa_receipt` (`mpesa_receipt_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. PAYMENT_TRANSACTIONS (Audit Log)
CREATE TABLE `payment_transactions` (
  `id` VARCHAR(36) PRIMARY KEY,
  `payment_id` VARCHAR(36) NOT NULL,
  `transaction_type` VARCHAR(50) NOT NULL,
  `status_code` VARCHAR(20) NOT NULL,
  `result_description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. TICKET_VERIFICATIONS TABLE (Gate Scanning Log)
CREATE TABLE `ticket_verifications` (
  `id` VARCHAR(36) PRIMARY KEY,
  `ticket_id` VARCHAR(36) NOT NULL,
  `verified_by_admin_id` VARCHAR(36) DEFAULT NULL,
  `gate_id` VARCHAR(50) NOT NULL,
  `result` ENUM('SUCCESS_FIRST_ENTRY', 'DENIED_DUPLICATE_ENTRY', 'DENIED_INVALID_TICKET', 'DENIED_REVOKED') NOT NULL,
  `device_info` VARCHAR(255) DEFAULT NULL,
  `notes` VARCHAR(255) DEFAULT NULL,
  `verified_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. NOTIFICATIONS TABLE
CREATE TABLE `notifications` (
  `id` VARCHAR(36) PRIMARY KEY,
  `user_id` VARCHAR(36) DEFAULT NULL,
  `recipient_phone` VARCHAR(30) NOT NULL,
  `recipient_email` VARCHAR(150) NOT NULL,
  `channel` ENUM('SMS', 'EMAIL', 'BOTH') NOT NULL DEFAULT 'BOTH',
  `subject` VARCHAR(200) NOT NULL,
  `message_body` TEXT NOT NULL,
  `status` ENUM('PENDING', 'SENT', 'FAILED') DEFAULT 'PENDING',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- SEED INITIAL DATA
-- =====================================================================

-- Teams
INSERT INTO `teams` (`id`, `name`, `short_name`, `country`, `founded_year`, `crest_url`, `jersey_primary_color`, `jersey_secondary_color`) VALUES
('team-ajax', 'AFC Ajax Amsterdam', 'AJA', 'Netherlands', 1900, '/assets/teams/ajax.svg', '#D2122E', '#FFFFFF'),
('team-bayern', 'FC Bayern Munich', 'FCB', 'Germany', 1900, '/assets/teams/bayern.svg', '#DC052D', '#0066B2');

-- Flagship Event
INSERT INTO `events` (
  `id`, `title`, `slug`, `home_team_id`, `away_team_id`,
  `event_date`, `kickoff_time`, `gates_open_time`,
  `venue_name`, `venue_city`, `venue_country`, `stadium_capacity`,
  `status`, `is_flagship`, `disclaimer_text`, `description`, `rules_and_entry`
) VALUES (
  'event-ajax-bayern-nairobi',
  'Ajax Amsterdam vs Bayern Munich – Kenya Football Spectacle',
  'ajax-amsterdam-vs-bayern-munich-kenya',
  'team-ajax',
  'team-bayern',
  '2026-12-12 17:00:00',
  '17:00 EAT (East Africa Time)',
  '13:00 EAT',
  'Talanta Sports City Stadium, Ngong Road',
  'Nairobi',
  'Kenya',
  60000,
  'CONFIRMED',
  1,
  'PROPOSED EVENT DATE & VENUE: Subject to final sanctioning, scheduling approval, and match authorization by the Football Kenya Federation (FKF) and participating clubs. All ticket bookings are backed by the 100% KickPass Money-Back Guarantee.',
  'Experience European football royalty on African soil as 4-time European Champions AFC Ajax square off against 6-time European Champions FC Bayern Munich in a historic exhibition match at the ultra-modern 60,000-seater Talanta Sports City Stadium in Nairobi, Kenya.',
  '1. Every attendee must present an authentic scannable KickPass QR electronic ticket (digital on smartphone or printed A4).\n2. National ID or Passport required at security turnstiles.\n3. Gates close strictly 30 minutes before kickoff.\n4. Prohibited items: fireworks, glass containers, professional camera telephoto lenses without accreditation, weapons, unauthorized outside commercial beverages.\n5. Family zones and dedicated accessibility ramps are available at Gate D.'
);

-- Ticket Categories
INSERT INTO `ticket_categories` (
  `id`, `event_id`, `name`, `code`, `price_kes`, `total_quota`, `available_quota`, `reserved_quota`,
  `gate_designation`, `seating_area`, `description`, `perks`, `is_active`, `sort_order`
) VALUES
('cat-vvip', 'event-ajax-bayern-nairobi', 'VVIP Presidential Hospitality', 'VVIP', 25000.00, 500, 388, 12, 'Gate A (VIP Royal Pavilion)', 'Presidential Suites & Tier 1 Center Box', 'The ultimate luxury football experience in East Africa. Includes private valet parking, gourmet 5-course banquet dining, fine wines, players meet-and-greet tunnel view, and commemorative collector match kit.', 'Private Valet Parking, Gourmet Dining & Drinks, Tunnel Club Access, Luxury Padded Armchairs, Matchday Scarf & Programme', 1, 1),

('cat-vip', 'event-ajax-bayern-nairobi', 'VIP Main Stand', 'VIP', 12500.00, 2500, 1840, 45, 'Gate B (Executive West Stand)', 'Main Grandstand Lower Tier (Halfway Line)', 'Prime central sightlines directly in line with the halfway line. Features dedicated lounge access, complimentary refreshments, private restrooms, and fast-track security turnstiles.', 'Lounge Bar Access, Complimentary Welcome Drink, Reserved Padded Seating, Dedicated Security Gate, Matchday Programme', 1, 2),

('cat-premium', 'event-ajax-bayern-nairobi', 'Premium Lower Bowl', 'PREMIUM', 5500.00, 10000, 7820, 120, 'Gate C & E (East & West Lower)', 'Lower Deck Covered Stand (Rows 10-30)', 'Close-up, high-energy view of pitch action and tactical formations. Covered seating with prime acoustics and rapid access to concessions.', 'Covered Lower Stand, Prime Pitch-Level Sightlines, Dedicated Concession Zones, Souvenir Lanyard Pass', 1, 3),

('cat-regular', 'event-ajax-bayern-nairobi', 'Regular Upper Tier', 'REGULAR', 2500.00, 22000, 16950, 200, 'Gate D & F (Upper Concourse East/West)', 'Upper Bowl Elevated Grandstand', 'Breathtaking panoramic stadium sightline overseeing the entire pitch and vibrant stadium choreographies. Excellent value for enthusiastic fans.', 'Panoramic Stadium Elevation, Full Pitch Overview, Direct Concourse Access, Numbered Zone Seating', 1, 4),

('cat-general', 'event-ajax-bayern-nairobi', 'General Admission (Ultras Curves)', 'GENERAL', 1000.00, 25000, 19400, 350, 'Gate G & H (North & South Terraces)', 'North & South Goal Curves (Behind Goal Nets)', 'Feel the thunderous beating heart of the match behind the goalposts where the supporters sing all 90 minutes. Electric atmosphere.', 'Behind-The-Goal Net Action, Authentic Fan Chants Atmosphere, Rapid Concourse Food Courts', 1, 5);

-- Seed Administrator Account (Super Admin)
INSERT INTO `administrators` (`id`, `username`, `full_name`, `email`, `password_hash`, `role`) VALUES
('admin-001', 'superadmin', 'Kenya Match Operations Director', 'admin@kickpass.co.ke', '$2b$10$wT0o3q6F0HkZ2/8v8VzT7.3eZkZ2v5uL8v7wP7xY9k9m8j2b4n7pG', 'SUPER_ADMIN'),
('admin-002', 'gatesteward', 'Talanta Gate Security Chief', 'steward@kickpass.co.ke', '$2b$10$wT0o3q6F0HkZ2/8v8VzT7.3eZkZ2v5uL8v7wP7xY9k9m8j2b4n7pG', 'GATE_STEWARD');
