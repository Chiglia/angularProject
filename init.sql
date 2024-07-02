CREATE DATABASE IF NOT EXISTS mydatabase;
CREATE USER IF NOT EXISTS 'myuser'@'%' IDENTIFIED BY 'mypassword';
GRANT ALL PRIVILEGES ON mydatabase.* TO 'myuser'@'%';
FLUSH PRIVILEGES;
CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT,
                    email VARCHAR(255) NOT NULL,
                    username VARCHAR(255) NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    PRIMARY KEY (id)
                );