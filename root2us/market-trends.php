<?php
require_once 'includes/db.php';
require_once 'includes/functions.php';

// Get filter parameters
$crop = isset($_GET['crop']) ? sanitizeInput($_GET['crop']) : '';
$location = isset($_GET['location']) ? sanitizeInput($_GET['location']) : '';

// Get market trends data
$filters = array_filter([
    'crop' => $crop,
    'location' => $location
]);

$trends = getMarketTrends($filters);

// Get unique crops and locations for filters
$crops = array_unique(array_column($trends, 'crop_name'));
$locations = array_unique(array_column($trends, 'location'));

// Find max price for chart scaling
$max_price = 0;
foreach ($trends as $trend) {
    $max_price = max($max_price, $trend['price']);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Market Trends - Root2Us</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/darkmode.css">
    <link rel="stylesheet" href="css/animations.css">
    <style>
        .trends-container {
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

        .filter-group select {
            padding: 0.5rem;
            border: 1px solid var(--shadow-color);
            border-radius: 5px;
            background-color: var(--bg-color);
            color: var(--text-color);
        }

        .chart-container {
            background-color: var(--card-bg);
            padding: 2rem;
            border-radius: 10px;
            margin-top: 2rem;
            box-shadow: 0 4px 6px var(--shadow-color);
            animation: fadeIn 0.8s ease;
        }

        .chart {
            display: flex;
            align-items: flex-end;
            gap: 1rem;
            height: 300px;
            margin-top: 2rem;
            padding-bottom: 2rem;
            border-bottom: 2px solid var(--shadow-color);
            position: relative;
        }

        .chart::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            width: 2px;
            height: calc(100% - 2rem);
            background-color: var(--shadow-color);
        }

        .bar-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
        }

        .bar {
            width: 100%;
            background-color: var(--primary-color);
            transition: height 0.3s ease;
            position: relative;
            border-radius: 4px 4px 0 0;
        }

        .bar:hover {
            background-color: var(--secondary-color);
        }

        .bar-label {
            font-size: 0.8rem;
            color: var(--text-color);
            text-align: center;
            transform: rotate(-45deg);
            white-space: nowrap;
            position: absolute;
            bottom: -3rem;
            left: 50%;
            transform-origin: left;
        }

        .bar-value {
            position: absolute;
            top: -1.5rem;
            left: 50%;
            transform: translateX(-50%);
            font-size: 0.8rem;
            color: var(--text-color);
        }

        .y-axis {
            position: absolute;
            left: -3rem;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            color: var(--text-color);
            font-size: 0.8rem;
        }

        .no-data {
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
            <a href="browse.php">Browse Products</a>
            <a href="market-trends.php" class="active">Market Trends</a>
            <a href="login.php" class="login-btn">Login</a>
            <button id="theme-toggle" class="theme-toggle">
                <span class="sun-icon">☀️</span>
                <span class="moon-icon">🌙</span>
            </button>
        </div>
    </nav>

    <div class="trends-container">
        <h1>Market Trends</h1>

        <div class="filters animate-fade-in">
            <form method="GET" action="">
                <div class="filter-group">
                    <label for="crop">Crop</label>
                    <select name="crop" id="crop">
                        <option value="">All Crops</option>
                        <?php foreach ($crops as $crop_name): ?>
                            <option value="<?php echo $crop_name; ?>" <?php echo $crop === $crop_name ? 'selected' : ''; ?>>
                                <?php echo $crop_name; ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="filter-group">
                    <label for="location">Location</label>
                    <select name="location" id="location">
                        <option value="">All Locations</option>
                        <?php foreach ($locations as $loc): ?>
                            <option value="<?php echo $loc; ?>" <?php echo $location === $loc ? 'selected' : ''; ?>>
                                <?php echo $loc; ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="filter-group" style="justify-content: flex-end;">
                    <button type="submit" class="btn primary-btn">Apply Filters</button>
                </div>
            </form>
        </div>

        <?php if (empty($trends)): ?>
            <div class="no-data animate-fade-in">
                <h3>No market data available</h3>
                <p>Try adjusting your filters or check back later for updated market trends.</p>
            </div>
        <?php else: ?>
            <div class="chart-container">
                <h2>Price Trends</h2>
                <div class="chart">
                    <div class="y-axis">
                        <?php 
                        $steps = 5;
                        for ($i = $steps; $i >= 0; $i--) {
                            $value = ($max_price / $steps) * $i;
                            echo "<span>₹" . number_format($value, 2) . "</span>";
                        }
                        ?>
                    </div>
                    <?php foreach ($trends as $trend): ?>
                        <div class="bar-container">
                            <div class="bar" style="height: <?php echo ($trend['price'] / $max_price) * 100; ?>%">
                                <span class="bar-value">₹<?php echo formatPrice($trend['price']); ?></span>
                                <span class="bar-label">
                                    <?php echo $trend['crop_name'] . ' - ' . $trend['location']; ?>
                                    <br>
                                    <?php echo date('M d', strtotime($trend['date'])); ?>
                                </span>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
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