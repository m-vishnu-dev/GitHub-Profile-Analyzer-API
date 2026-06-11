CREATE DATABASE IF NOT EXISTS github_analyzer;
USE github_analyzer;

CREATE TABLE IF NOT EXISTS analyzed_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    bio TEXT,
    public_repos INT DEFAULT 0,
    followers INT DEFAULT 0,
    following INT DEFAULT 0,
    avatar_url VARCHAR(255),
    total_stars INT DEFAULT 0,
    total_forks INT DEFAULT 0,
    account_age_years DECIMAL(5, 2) DEFAULT 0.00,
    top_languages JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
