<?php
require_once 'includes/auth.php';
require_once 'includes/functions.php';

$error = '';
$role = isset($_GET['type']) ? sanitizeInput($_GET['type']) : 'buyer';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = sanitizeInput($_POST['username']);
    $email = sanitizeInput($_POST['email']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    $role = sanitizeInput($_POST['role']);

    // Validate password match
    if ($password !== $confirm_password) {
        $error = 'Passwords do not match';
    } else {
        $result = registerUser($username, $email, $password, $role);

        if ($result === true) {
            // Auto login after registration
            loginUser($username, $password);
            
            // Redirect based on role
            switch ($role) {
                case 'seller':
                    header('Location: dashboard/seller.php');
                    break;
                case 'buyer':
                    header('Location: dashboard/buyer.php');
                    break;
                default:
                    header('Location: index.html');
            }
            exit();
        } else {
            $error = $result['error'];
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - Root2Us</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/darkmode.css">
    <link rel="stylesheet" href="css/animations.css">
    <style>
        .register-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }

        .register-form {
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

        .form-group input,
        .form-group select {
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

        .login-link {
            text-align: center;
            margin-top: 1rem;
        }

        .login-link a {
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

    <div class="register-container">
        <form class="register-form" method="POST" action="">
            <h2 style="text-align: center; margin-bottom: 2rem;">Create an Account</h2>
            
            <?php if ($error): ?>
                <div class="error-message"><?php echo $error; ?></div>
            <?php endif; ?>

            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>

            <div class="form-group">
                <label for="confirm_password">Confirm Password</label>
                <input type="password" id="confirm_password" name="confirm_password" required>
            </div>

            <div class="form-group">
                <label for="role">I want to</label>
                <select id="role" name="role" required>
                    <option value="buyer" <?php echo $role === 'buyer' ? 'selected' : ''; ?>>Buy Products</option>
                    <option value="seller" <?php echo $role === 'seller' ? 'selected' : ''; ?>>Sell Products</option>
                </select>
            </div>

            <button type="submit" class="btn primary-btn" style="width: 100%;">Register</button>

            <div class="login-link">
                <p>Already have an account? <a href="login.php">Login here</a></p>
            </div>
        </form>
    </div>

    <script src="js/darkmode.js"></script>
</body>
</html>