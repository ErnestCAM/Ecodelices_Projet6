use ecodelicesdb;
SELECT * FROM password_reset_tokens WHERE token = 'acd2d5fa03a34d9cf572d8f03fcb841c6dc700257eb7e9045c2d08f4360190ee';
desc table order_items;

DELETE FROM users WHERE id = 1;

UPDATE users SET role = 'admin' WHERE id = 3;


SELECT token, expiration, NOW(), expiration > NOW() as encore_valide
FROM password_reset_tokens
WHERE token = 'acd2d5fa03a34d9cf572d8f03fcb841c6dc700257eb7e9045c2d08f4360190ee';


CREATE TABLE password_reset_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expiration DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

