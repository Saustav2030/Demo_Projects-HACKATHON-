<?php
session_start();
require_once 'db.php';

// User registration function
function registerUser($username, $email, $password, $role) {
    global $conn;
    
    try {
        // Validate input
        if (empty($username) || empty($email) || empty($password) || empty($role)) {
            throw new Exception('All fields are required');
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Invalid email format');
        }

        // Check if username or email already exists
        $stmt = $conn->prepare('SELECT id FROM users WHERE username = ? OR email = ?');
        $stmt->bind_param('ss', $username, $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            throw new Exception('Username or email already exists');
        }

        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Insert new user
        $stmt = $conn->prepare('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)');
        $stmt->bind_param('ssss', $username, $email, $hashedPassword, $role);
        
        if (!$stmt->execute()) {
            throw new Exception('Registration failed');
        }

        return true;
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

// User login function
function loginUser($username, $password) {
    global $conn;
    
    try {
        // Validate input
        if (empty($username) || empty($password)) {
            throw new Exception('All fields are required');
        }

        // Get user
        $stmt = $conn->prepare('SELECT id, username, password, role FROM users WHERE username = ?');
        $stmt->bind_param('s', $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            throw new Exception('Invalid username or password');
        }

        $user = $result->fetch_assoc();

        // Verify password
        if (!password_verify($password, $user['password'])) {
            throw new Exception('Invalid username or password');
        }

        // Set session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];

        return true;
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

// Check if user is logged in
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

// Check user role
function hasRole($role) {
    return isset($_SESSION['role']) && $_SESSION['role'] === $role;
}

// Require authentication
function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: /login.php');
        exit();
    }
}

// Require specific role
function requireRole($role) {
    requireLogin();
    if (!hasRole($role)) {
        header('Location: /index.html');
        exit();
    }
}

// Logout function
function logout() {
    session_destroy();
    header('Location: /index.html');
    exit();
}
?>