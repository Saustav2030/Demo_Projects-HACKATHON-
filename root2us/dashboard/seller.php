<?php
require_once '../includes/auth.php';
require_once '../includes/functions.php';

// Require seller authentication
requireRole('seller');

// Handle product submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'add':
                $title = sanitizeInput($_POST['title']);
                $description = sanitizeInput($_POST['description']);
                $category = sanitizeInput($_POST['category']);
                $price = floatval($_POST['price']);

                // Handle image upload
                $image_path = '';
                if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
                    $upload_result = uploadFile($_FILES['image']);
                    if (!isset($upload_result['error'])) {
                        $image_path = $upload_result;
                    }
                }

                // Insert product
                $stmt = $conn->prepare('INSERT INTO products (seller_id, title, description, category, price, image_path) VALUES (?, ?, ?, ?, ?, ?)');
                $stmt->bind_param('isssds', $_SESSION['user_id'], $title, $description, $category, $price, $image_path);
                $stmt->execute();
                break;

            case 'delete':
                $product_id = intval($_POST['product_id']);
                $stmt = $conn->prepare('DELETE FROM products WHERE id = ? AND seller_id = ?');
                $stmt->bind_param('ii', $product_id, $_SESSION['user_id']);
                $stmt->execute();
                break;
        }
    }
}

// Get seller's products
$stmt = $conn->prepare('SELECT * FROM products WHERE seller_id = ? ORDER BY created_at DESC');
$stmt->bind_param('i', $_SESSION['user_id']);
$stmt->execute();
$products = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// Get categories
$categories = getCategories();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seller Dashboard - Root2Us</title>
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="../css/darkmode.css">
    <link rel="stylesheet" href="../css/animations.css">
    <style>
        .dashboard-container {
            padding: 6rem 5% 2rem;
        }

        .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }

        .add-product-form {
            background-color: var(--card-bg);
            padding: 2rem;
            border-radius: 10px;
            margin-bottom: 2rem;
            box-shadow: 0 4px 6px var(--shadow-color);
            animation: fadeIn 0.8s ease;
        }

        .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .form-group label {
            color: var(--text-color);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
            padding: 0.8rem;
            border: 1px solid var(--shadow-color);
            border-radius: 5px;
            background-color: var(--bg-color);
            color: var(--text-color);
        }

        .form-group textarea {
            resize: vertical;
            min-height: 100px;
        }

        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 2rem;
        }

        .product-card {
            background-color: var(--card-bg);
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px var(--shadow-color);
            transition: var(--transition);
            animation: fadeIn 0.8s ease;
        }

        .product-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }

        .product-info {
            padding: 1.5rem;
        }

        .product-price {
            color: var(--primary-color);
            font-size: 1.2rem;
            font-weight: bold;
            margin: 0.5rem 0;
        }

        .product-status {
            display: inline-block;
            padding: 0.3rem 0.8rem;
            border-radius: 15px;
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }

        .status-pending {
            background-color: #f1c40f;
            color: #000;
        }

        .status-approved {
            background-color: #2ecc71;
            color: #fff;
        }

        .status-rejected {
            background-color: #e74c3c;
            color: #fff;
        }

        .product-actions {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
        }

        .product-actions form {
            flex: 1;
        }

        .product-actions button {
            width: 100%;
            padding: 0.5rem;
            font-size: 0.9rem;
        }

        .no-products {
            text-align: center;
            padding: 2rem;
            background-color: var(--card-bg);
            border-radius: 10px;
            margin-top: 2rem;
        }
    </style>
</head>
<body class="light-mode">
    <nav class="navbar">
        <div class="nav-brand">
            <a href="../index.html">Root2Us</a>
        </div>
        <div class="nav-links">
            <a href="seller.php" class="active">Dashboard</a>
            <a href="../browse.php">Browse Products</a>
            <a href="../market-trends.php">Market Trends</a>
            <a href="../includes/logout.php">Logout</a>
            <button id="theme-toggle" class="theme-toggle">
                <span class="sun-icon">☀️</span>
                <span class="moon-icon">🌙</span>
            </button>
        </div>
    </nav>

    <div class="dashboard-container">
        <div class="dashboard-header">
            <h1>Seller Dashboard</h1>
            <button class="btn primary-btn" onclick="document.getElementById('addProductForm').style.display = 'block'">Add New Product</button>
        </div>

        <form id="addProductForm" class="add-product-form" method="POST" enctype="multipart/form-data" style="display: none;">
            <h2>Add New Product</h2>
            <input type="hidden" name="action" value="add">
            
            <div class="form-grid">
                <div class="form-group">
                    <label for="title">Product Title</label>
                    <input type="text" id="title" name="title" required>
                </div>

                <div class="form-group">
                    <label for="category">Category</label>
                    <select name="category" id="category" required>
                        <?php foreach ($categories as $key => $value): ?>
                            <option value="<?php echo $key; ?>"><?php echo $value; ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="form-group">
                    <label for="price">Price (₹)</label>
                    <input type="number" id="price" name="price" min="0" step="0.01" required>
                </div>

                <div class="form-group">
                    <label for="image">Product Image</label>
                    <input type="file" id="image" name="image" accept="image/*" required>
                </div>
            </div>

            <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" name="description" required></textarea>
            </div>

            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <button type="submit" class="btn primary-btn">Add Product</button>
                <button type="button" class="btn secondary-btn" onclick="document.getElementById('addProductForm').style.display = 'none'">Cancel</button>
            </div>
        </form>

        <?php if (empty($products)): ?>
            <div class="no-products animate-fade-in">
                <h3>No products listed yet</h3>
                <p>Start selling by adding your first product!</p>
            </div>
        <?php else: ?>
            <div class="products-grid">
                <?php foreach ($products as $product): ?>
                    <div class="product-card animate-on-scroll">
                        <img src="../uploads/<?php echo $product['image_path']; ?>" 
                             alt="<?php echo $product['title']; ?>" 
                             class="product-image">
                        <div class="product-info">
                            <h3><?php echo $product['title']; ?></h3>
                            <p class="product-price">₹<?php echo formatPrice($product['price']); ?></p>
                            <span class="product-status status-<?php echo $product['status']; ?>">
                                <?php echo ucfirst($product['status']); ?>
                            </span>
                            <div class="product-actions">
                                <form method="POST" onsubmit="return confirm('Are you sure you want to delete this product?');">
                                    <input type="hidden" name="action" value="delete">
                                    <input type="hidden" name="product_id" value="<?php echo $product['id']; ?>">
                                    <button type="submit" class="btn secondary-btn">Delete</button>
                                </form>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>

    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <h3>Root2Us</h3>
                <p>Empowering farmers, connecting communities</p>
            </div>
            <div class="footer-section">
                <h3>Quick Links</h3>
                <a href="../about.html">About Us</a>
                <a href="../browse.php">Browse Products</a>
                <a href="../market-trends.php">Market Trends</a>
            </div>
            <div class="footer-section">
                <h3>Contact</h3>
                <p>Email: info@root2us.com</p>
                <p>Phone: (123) 456-7890</p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 Root2Us. All rights reserved.</p>
        </div>
    </footer>

    <script src="../js/main.js"></script>
    <script src="../js/darkmode.js"></script>
</body>
</html>