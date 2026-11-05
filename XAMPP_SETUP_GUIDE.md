# KickPass Kenya - XAMPP & MySQL Local Installation Guide

This guide provides step-by-step instructions for running the **KickPass Kenya** Football Ticket Booking Platform locally on **XAMPP** (Apache, PHP, MySQL, phpMyAdmin) or in a **Node.js + MySQL / SQLite** environment.

---

## 1. System Requirements

- **XAMPP** (PHP 8.1+, MySQL 8.0+ / MariaDB 10.4+)
- **Node.js** (v18.0 or newer) & **npm**
- Modern Web Browser (Chrome, Firefox, Edge, Safari)

---

## 2. Step-by-Step Installation on XAMPP

### Step 1: Install and Launch XAMPP
1. Download XAMPP for Windows/macOS/Linux from [Apache Friends](https://www.apachefriends.org/).
2. Complete the installation with default components (ensure **Apache**, **MySQL**, and **phpMyAdmin** are selected).
3. Open the **XAMPP Control Panel** and click **Start** next to **Apache** and **MySQL**.
4. Both services should display green status indicators.

### Step 2: Copy Project into `htdocs`
1. Navigate to your XAMPP installation directory:
   - **Windows:** `C:\xampp\htdocs\`
   - **macOS:** `/Applications/XAMPP/xamppfiles/htdocs/`
   - **Linux:** `/opt/lampp/htdocs/`
2. Create or copy this project folder into `htdocs`:
   ```bash
   # Destination folder:
   C:\xampp\htdocs\kickpass-kenya\
   ```

### Step 3: Import the MySQL Database via phpMyAdmin
1. Open your web browser and navigate to:
   ```
   http://localhost/phpmyadmin/
   ```
2. Click **New** in the left sidebar to create a new database.
3. Name the database: `kickpass_db` and select collation `utf8mb4_unicode_ci`, then click **Create**.
4. In the top navigation bar of `kickpass_db`, click the **Import** tab.
5. Click **Choose File** and select `database.sql` located at the root of this project:
   ```
   C:\xampp\htdocs\kickpass-kenya\database.sql
   ```
6. Scroll down and click **Import** (or **Go**).
7. The following 12 relational tables will be created with complete initial seed data:
   - `users`
   - `administrators`
   - `teams` (AFC Ajax & FC Bayern Munich)
   - `events` (Flagship match at Talanta Stadium)
   - `ticket_categories` (VVIP, VIP, Premium, Regular, General)
   - `bookings`
   - `booking_items`
   - `tickets` (with unique cryptographic signatures)
   - `payments` (M-PESA STK Push & Card transactions)
   - `payment_transactions` (Audit ledger)
   - `ticket_verifications` (Gate turnstile check-in log)
   - `notifications`

### Step 4: Configure Database Connection Credentials
A configuration file template is provided in `api/config.php` and `server.ts`:
```php
<?php
// api/config.php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', ''); // Default XAMPP MySQL password is blank
define('DB_NAME', 'kickpass_db');
define('DB_PORT', 3306);

// Safaricom Daraja M-PESA Test Credentials (Sandbox)
define('MPESA_SHORTCODE', '174379');
define('MPESA_PASSKEY', 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919');
define('MPESA_ENV', 'sandbox');
```

---

## 3. Running the Application

### Running with Node.js Full-Stack (Default Development Server)
```bash
# 1. Install dependencies
npm install

# 2. Start full-stack Node.js server (runs API + UI on port 3000)
npm run dev

# 3. Open in browser:
http://localhost:3000/
```

### Running with Apache in XAMPP
```bash
# 1. Build the production frontend assets
npm run build

# 2. The compiled assets in /dist will be served directly by Apache at:
http://localhost/kickpass-kenya/dist/
```

---

## 4. Testing Core Platform Features

### A. Customer Booking & M-PESA STK Push
1. Visit the homepage and review the **Ajax vs Bayern Munich** showdown countdown.
2. Click **BOOK YOUR TICKETS NOW** or select a tier from the interactive Talanta Stadium seating map.
3. Fill in lead attendee details (Name, Email, Kenyan Phone number `0712345678`).
4. Proceed to **Payment** and select **M-PESA STK Push**.
5. Click **Pay Now**: an STK Push PIN prompt will simulate directly on screen.
6. Once completed, your confirmed electronic ticket with unique QR code and serial number will generate automatically.

### B. Turnstile QR Code Verification (Gate Stewards)
1. In the navigation bar, click **Gate Scanner**.
2. Enter a ticket serial number (e.g. `TKT-2026-AJXBYN-7741`) or paste a QR code string.
3. Click **Verify Ticket**: The system verifies ticket validity and marks the ticket as `CHECKED_IN`.
4. Scan the **same ticket again**: The system triggers an immediate duplicate admission alert (`ALERT: DUPLICATE ENTRY DENIED`).

### C. Administrator Dashboard
1. Click **Admin** in the top navigation bar.
2. View real-time revenue in KES, passes sold, and stadium occupancy percentage.
3. Under **Match & Venue Configurations**, update the proposed date, kickoff time, venue, or event status.
4. Under **Ticket Pricing & Quotas**, adjust tier prices in KES or available seats.
5. Under **Bookings Ledger**, review all customer orders and click **Export Bookings CSV**.

---

## 5. Support & Troubleshooting

- **Port 3000 Conflict:** If port 3000 is occupied, set `PORT=3001` in your environment.
- **MySQL Connection Error:** Ensure the MySQL service in XAMPP is running and that user `root` has permission to access `kickpass_db`.
- **M-PESA Sandbox:** In sandbox mode, STK pushes simulate instantaneous successful authorization for any valid Kenyan phone number.
