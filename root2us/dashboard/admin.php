<?php   
require_once '../includes/auth.php';
require_once '../includes/functions.php';

// Require admin authentication
requireRole('admin');

// Handle product approval/rejection
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action']) && isset($_POST['product_id'])) {
        $product_id = intval($_POST['product_id']);
        $status = $_POST['action'] === 'approve' ? 'approved' : 'rejected';

        $stmt = $conn->prepare('UPDATE products SET status = ? WHERE id = ?');
        $stmt->bind_param('si', $status, $product_id);
        $stmt->execute();
    }
}

// Get pending products
$stmt = $conn->prepare('SELECT p.*, u.username as seller_name 
                       FROM products p 
                       JOIN users u ON p.seller_id = u.id 
                       WHERE p.status = "pending"
                       ORDER BY p.created_at DESC');
$stmt->execute();
$pending_products = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// Get user statistics
$stmt = $conn->prepare('SELECT role, COUNT(*) as count FROM users GROUP BY role');
$stmt->execute();
$user_stats = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// Get product statistics
$stmt = $conn->prepare('SELECT status, COUNT(*) as count FROM products GROUP BY status');
$stmt->execute();
$product_stats = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Root2Us</title>
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="../css/darkmode.css">
    <link rel="stylesheet" href="../css/animations.css">
    <style>
        .dashboard-container {
            padding: 6rem 5% 2rem;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .stat-card {
            background-color: var(--card-bg);
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 6px var(--shadow-color);
            text-align: center;
            animation: fadeIn 0.8s ease;
        }

        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: var(--primary-color);
            margin: 0.5rem 0;
        }

        .products-table {
            width: 100%;
            border-collapse: collapse;
            background-color: var(--card-bg);
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px var(--shadow-color);
            margin-top: 2rem;
            animation: fadeIn 0.8s ease;
        }

        .products-table th,
        .products-table td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid var(--shadow-color);
        }

        .products-table th {
            background-color: var(--primary-color);
            color: white;
        }

        .products-table tr:last-child td {
            border-bottom: none;
        }

        .products-table tr:hover {
            background-color: var(--bg-color);
        }

        .product-image-small {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 5px;
        }

        .action-buttons {
            display: flex;
            gap: 0.5rem;
        }

        .action-buttons form {
            flex: 1;
        }

        .action-buttons button {
            width: 100%;
            padding: 0.5rem;
            font-size: 0.8rem;
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
            <a href="admin.php" class="active">Dashboard</a>
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
        <h1>Admin Dashboard</h1>

        <div class="stats-grid">
            <?php foreach ($user_stats as $stat): ?>
                <div class="stat-card animate-on-scroll">
                    <h3><?php echo ucfirst($stat['role']); ?>s</h3>
                    <div class="stat-number"><?php echo $stat['count']; ?></div>
                    <p>Registered Users</p>
                </div>
            <?php endforeach; ?>

            <?php foreach ($product_stats as $stat): ?>
                <div class="stat-card animate-on-scroll">
                    <h3><?php echo ucfirst($stat['status']); ?></h3>
                    <div class="stat-number"><?php echo $stat['count']; ?></div>
                    <p>Products</p>
                </div>
            <?php endforeach; ?>
        </div>

        <h2>Pending Products</h2>
        <?php if (empty($pending_products)): ?>
            <div class="no-products animate-fade-in">
                <h3>No pending products</h3>
                <p>All products have been reviewed!</p>
            </div>
        <?php else: ?>
            <div class="table-responsive">
                <table class="products-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Seller</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($pending_products as $product): ?>
                            <tr class="animate-on-scroll">
                                <td>
                                    <img src="../uploads/<?php echo $product['image_path']; ?>" 
                                         alt="<?php echo $product['title']; ?>" 
                                         class="product-image-small">
                                </td>
                                <td><?php echo $product['title']; ?></td>
                                <td><?php echo $product['seller_name']; ?></td>
                                <td><?php echo $categories[$product['category']]; ?></td>
                                <td>₹<?php echo formatPrice($product['price']); ?></td>
                                <td>
                                    <div class="action-buttons">
                                        <form method="POST">
                                            <input type="hidden" name="action" value="approve">
                                            <input type="hidden" name="product_id" value="<?php echo $product['id']; ?>">
                                            <button type="submit" class="btn primary-btn">Approve</button>
                                        </form>
                                        <form method="POST">
                                            <input type="hidden" name="action" value="reject">
                                            <input type="hidden" name="product_id" value="<?php echo $product['id']; ?>">
                                            <button type="submit" class="btn secondary-btn">Reject</button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
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