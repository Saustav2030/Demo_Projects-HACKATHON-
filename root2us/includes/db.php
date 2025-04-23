<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'root2us');

// Create database connection
function connectDB() {
    try {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS);
        
        // Check connection
        if ($conn->connect_error) {
            throw new Exception("Connection failed: " . $conn->connect_error);
        }

        // Create database if not exists
        $sql = "CREATE DATABASE IF NOT EXISTS " . DB_NAME;
        if ($conn->query($sql) === FALSE) {
            throw new Exception("Error creating database: " . $conn->error);
        }

        // Select the database
        $conn->select_db(DB_NAME);

        // Create necessary tables if they don't exist
        createTables($conn);

        return $conn;
    } catch (Exception $e) {
        die("Database Error: " . $e->getMessage());
    }
}

// Create necessary tables
function createTables($conn) {
    // Users table
    $sql = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        role ENUM('buyer', 'seller', 'admin') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    if ($conn->query($sql) === FALSE) {
        throw new Exception("Error creating users table: " . $conn->error);
    }

    // Products table
    $sql = "CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        seller_id INT NOT NULL,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        category VARCHAR(50) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        image_path VARCHAR(255),
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (seller_id) REFERENCES users(id)
    )";
    
    if ($conn->query($sql) === FALSE) {
        throw new Exception("Error creating products table: " . $conn->error);
    }

    // Market trends table
    $sql = "CREATE TABLE IF NOT EXISTS market_trends (
        id INT AUTO_INCREMENT PRIMARY KEY,
        crop_name VARCHAR(50) NOT NULL,
        location VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    if ($conn->query($sql) === FALSE) {
        throw new Exception("Error creating market_trends table: " . $conn->error);
    }

    // Check if admin exists
    $result = $conn->query("SELECT * FROM users WHERE role = 'admin' LIMIT 1");
    if ($result->num_rows == 0) {
        // Create default admin account
        $admin_username = "admin";
        $admin_password = password_hash("admin123", PASSWORD_DEFAULT);
        $admin_email = "admin@root2us.com";
        
        $sql = "INSERT INTO users (username, password, email, role) 
                VALUES ('$admin_username', '$admin_password', '$admin_email', 'admin')";
        
        if ($conn->query($sql) === FALSE) {
            throw new Exception("Error creating admin account: " . $conn->error);
        }
    }
}

// Get database connection
$conn = connectDB();
?>