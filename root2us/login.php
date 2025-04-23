<?php
require_once 'includes/auth.php';
require_once 'includes/functions.php';

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = sanitizeInput($_POST['username']);
    $password = $_POST['password'];

    $result = loginUser($username, $password);

    if ($result === true) {
        // Redirect based on role
        switch ($_SESSION['role']) {
            case 'seller':
                header('Location: dashboard/seller.php');
                break;
            case 'buyer':
                header('Location: dashboard/buyer.php');
                break;
            case 'admin':
                header('Location: dashboard/admin.php');
                break;
            default:
                header('Location: index.html');
        }
        exit();
    } else {
        $error = $result['error'];
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Root2Us</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/darkmode.css">
    <link rel="stylesheet" href="css/animations.css">
    <style>
        .login-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }

        .login-form {
            background-color: var(--card-bg);
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 6px var(--shadow-color);
            width: 100%;
            max-width: 400px;
            animation: fadeIn 0.8s ease;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--text-color);
        }

        .form-group input {
            width: 100%;
            padding: 0.8rem;
            border: 1px solid var(--shadow-color);
            border-radius: 5px;
            background-color: var(--bg-color);
            color: var(--text-color);
        }

        .error-message {
            color: #e74c3c;
            margin-bottom: 1rem;
        }

        .register-link {
            text-align: center;
            margin-top: 1rem;
        }

        .register-link a {
            color: var(--primary-color);
            text-decoration: none;
        }
    </style>
</head>
<body class="light-mode">
    <nav class="navbar">
        <div class="nav-brand">
            <a href="index.html">Root2Us</a>
        </div>
        <div class="nav-links">
            <button id="theme-toggle" class="theme-toggle">
                <span class="sun-icon">☀️</span>
                <span class="moon-icon">🌙</span>
            </button>
        </div>
    </nav>

    <div class="login-container">
        <form class="login-form" method="POST" action="">
            <h2 style="text-align: center; margin-bottom: 2rem;">Login to Root2Us</h2>
            
            <?php if ($error): ?>
                <div class="error-message"><?php echo $error; ?></div>
            <?php endif; ?>

            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>

            <button type="submit" class="btn primary-btn" style="width: 100%;">Login</button>

            <div class="register-link">
                <p>Don't have an account? <a href="register.php">Register here</a></p>
            </div>
        </form>
    </div>

    <script src="js/darkmode.js"></script>
</body>
</html>