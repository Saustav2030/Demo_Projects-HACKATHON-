<?php
require_once 'includes/db.php';
require_once 'includes/functions.php';

// Get filter parameters
$category = isset($_GET['category']) ? sanitizeInput($_GET['category']) : '';
$min_price = isset($_GET['min_price']) ? floatval($_GET['min_price']) : '';
$max_price = isset($_GET['max_price']) ? floatval($_GET['max_price']) : '';

// Get products with filters
$filters = array_filter([
    'category' => $category,
    'min_price' => $min_price,
    'max_price' => $max_price
]);

$products = getProducts($filters);
$categories = getCategories();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Browse Products - Root2Us</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/darkmode.css">
    <link rel="stylesheet" href="css/animations.css">
    <style>
        .browse-container {
            padding: 6rem 5% 2rem;
        }

        .filters {
            background-color: var(--card-bg);
            padding: 1.5rem;
            border-radius: 10px;
            margin-bottom: 2rem;
            box-shadow: 0 2px 4px var(--shadow-color);
        }

        .filters form {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }

        .filter-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .filter-group label {
            color: var(--text-color);
        }

        .filter-group select,
        .filter-group input {
            padding: 0.5rem;
            border: 1px solid var(--shadow-color);
            border-radius: 5px;
            background-color: var(--bg-color);
            color: var(--text-color);
        }

        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .product-card {
            background-color: var(--card-bg);
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px var(--shadow-color);
            transition: var(--transition);
            animation: fadeIn 0.8s ease;
        }

        .product-card:hover {
            transform: translateY(-5px);
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

        .product-seller {
            font-size: 0.9rem;
            color: var(--text-color);
            margin-bottom: 1rem;
        }

        .product-actions {
            display: flex;
            gap: 1rem;
        }

        .product-actions .btn {
            flex: 1;
            text-align: center;
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
            <a href="index.html">Root2Us</a>
        </div>
        <div class="nav-links">
            <a href="index.html">Home</a>
            <a href="about.html">About Us</a>
            <a href="browse.php" class="active">Browse Products</a>
            <a href="market-trends.php">Market Trends</a>
            <a href="login.php" class="login-btn">Login</a>
            <button id="theme-toggle" class="theme-toggle">
                <span class="sun-icon">☀️</span>
                <span class="moon-icon">🌙</span>
            </button>
        </div>
    </nav>

    <div class="browse-container">
        <h1>Browse Products</h1>

        <div class="filters animate-fade-in">
            <form method="GET" action="">
                <div class="filter-group">
                    <label for="category">Category</label>
                    <select name="category" id="category">
                        <option value="">All Categories</option>
                        <?php foreach ($categories as $key => $value): ?>
                            <option value="<?php echo $key; ?>" <?php echo $category === $key ? 'selected' : ''; ?>>
                                <?php echo $value; ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="filter-group">
                    <label for="min_price">Min Price</label>
                    <input type="number" name="min_price" id="min_price" min="0" step="0.01" 
                           value="<?php echo $min_price; ?>">
                </div>

                <div class="filter-group">
                    <label for="max_price">Max Price</label>
                    <input type="number" name="max_price" id="max_price" min="0" step="0.01"
                           value="<?php echo $max_price; ?>">
                </div>

                <div class="filter-group" style="justify-content: flex-end;">
                    <button type="submit" class="btn primary-btn">Apply Filters</button>
                </div>
            </form>
        </div>

        <?php if (empty($products)): ?>
            <div class="no-products animate-fade-in">
                <h3>No products found</h3>
                <p>Try adjusting your filters or check back later for new products.</p>
            </div>
        <?php else: ?>
            <div class="products-grid">
                <?php foreach ($products as $product): ?>
                    <div class="product-card animate-on-scroll">
                        <img src="uploads/<?php echo $product['image_path']; ?>" 
                             alt="<?php echo $product['title']; ?>" 
                             class="product-image">
                        <div class="product-info">
                            <h3><?php echo $product['title']; ?></h3>
                            <p class="product-price">₹<?php echo formatPrice($product['price']); ?></p>
                            <p class="product-seller">Seller: <?php echo $product['seller_name']; ?></p>
                            <div class="product-actions">
                                <a href="<?php echo generateWhatsAppLink('1234567890', 'Hi, I\'m interested in your product: ' . $product['title']); ?>" 
                                   class="btn secondary-btn" target="_blank">Contact Seller</a>
                                <button class="btn primary-btn" onclick="alert('Payment integration coming soon!')">Buy Now</button>
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
                <a href="about.html">About Us</a>
                <a href="browse.php">Browse Products</a>
                <a href="market-trends.php">Market Trends</a>
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

    <script src="js/main.js"></script>
    <script src="js/darkmode.js"></script>
</body>
</html>