<?php
require_once 'db.php';

// Handle file upload
function uploadFile($file, $targetDir = '../uploads/') {
    try {
        // Create uploads directory if it doesn't exist
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        // Generate unique filename
        $fileName = uniqid() . '_' . basename($file['name']);
        $targetPath = $targetDir . $fileName;
        
        // Check file type
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!in_array($file['type'], $allowedTypes)) {
            throw new Exception('Only JPG, PNG & GIF files are allowed');
        }

        // Check file size (5MB max)
        if ($file['size'] > 5000000) {
            throw new Exception('File is too large (max 5MB)');
        }

        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            throw new Exception('Failed to upload file');
        }

        return $fileName;
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

// Sanitize input
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Format price
function formatPrice($price) {
    return number_format($price, 2);
}

// Get product categories
function getCategories() {
    return [
        'fruits' => 'Fruits',
        'vegetables' => 'Vegetables',
        'grains' => 'Grains',
        'pulses' => 'Pulses',
        'spices' => 'Spices',
        'others' => 'Others'
    ];
}

// Get product by ID
function getProduct($productId) {
    global $conn;
    
    try {
        $stmt = $conn->prepare('SELECT p.*, u.username as seller_name 
                                FROM products p 
                                JOIN users u ON p.seller_id = u.id 
                                WHERE p.id = ?');
        $stmt->bind_param('i', $productId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            return null;
        }

        return $result->fetch_assoc();
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

// Get products with filters
function getProducts($filters = []) {
    global $conn;
    
    try {
        $sql = 'SELECT p.*, u.username as seller_name 
                FROM products p 
                JOIN users u ON p.seller_id = u.id 
                WHERE p.status = "approved"';
        $params = [];
        $types = '';

        if (!empty($filters['category'])) {
            $sql .= ' AND p.category = ?';
            $params[] = $filters['category'];
            $types .= 's';
        }

        if (!empty($filters['min_price'])) {
            $sql .= ' AND p.price >= ?';
            $params[] = $filters['min_price'];
            $types .= 'd';
        }

        if (!empty($filters['max_price'])) {
            $sql .= ' AND p.price <= ?';
            $params[] = $filters['max_price'];
            $types .= 'd';
        }

        $sql .= ' ORDER BY p.created_at DESC';

        $stmt = $conn->prepare($sql);
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->fetch_all(MYSQLI_ASSOC);
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

// Generate WhatsApp link
function generateWhatsAppLink($phone, $message) {
    $phone = preg_replace('/[^0-9]/', '', $phone);
    $message = urlencode($message);
    return "https://wa.me/$phone?text=$message";
}

// Get market trends data
function getMarketTrends($filters = []) {
    global $conn;
    
    try {
        $sql = 'SELECT * FROM market_trends';
        $params = [];
        $types = '';

        if (!empty($filters['crop'])) {
            $sql .= ' WHERE crop_name = ?';
            $params[] = $filters['crop'];
            $types .= 's';
        }

        if (!empty($filters['location'])) {
            $sql .= empty($filters['crop']) ? ' WHERE' : ' AND';
            $sql .= ' location = ?';
            $params[] = $filters['location'];
            $types .= 's';
        }

        $sql .= ' ORDER BY date DESC';

        $stmt = $conn->prepare($sql);
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->fetch_all(MYSQLI_ASSOC);
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}
?>