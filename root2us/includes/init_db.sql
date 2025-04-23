-- Initialize admin user
INSERT INTO users (username, password, email, role) 
SELECT 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@root2us.com', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE role = 'admin');

-- Sample market trends data
INSERT INTO market_trends (crop_name, location, price, date) VALUES
('Rice', 'Punjab', 2500.00, CURDATE()),
('Wheat', 'Haryana', 1800.00, CURDATE()),
('Cotton', 'Gujarat', 5500.00, CURDATE()),
('Sugarcane', 'Maharashtra', 300.00, CURDATE()),
('Potato', 'Uttar Pradesh', 1200.00, CURDATE());