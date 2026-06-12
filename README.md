 GitHub Profile Analyzer API
A robust, public Node.js & Express REST API that analyzes GitHub user profiles. It aggregates repository statistics (total stars, total forks, account age, and top programming languages) and stores/retrieves the results using a MySQL database.
**Live Deployment URL:** [https://git-hub-profile-analyzer-api-mu.vercel.app](https://git-hub-profile-analyzer-api-mu.vercel.app)
---
## Features
- **Profile Aggregator Engine:** Automatically fetches profile data and up to 100 public repositories for a given GitHub username.
- **Metrics Calculator:**
  - **Total Stars:** Computes the sum of all stargazers across public repositories.
  - **Total Forks:** Computes the sum of all forks across public repositories.
  - **Account Age:** Calculates the years since the account was created.
  - **Language Breakdown:** Aggregates and counts repositories by programming language, sorted descending.
- **MySQL Persistence:** Caches analysis histories in a relational schema (supports upserts for updates).
- **Vercel Serverless Ready:** Seamlessly deployed using `@vercel/node` serverless functions.
- **Fully Public API:** No authentication required to run analyses or look up profiles.
---
## Tech Stack
- **Backend:** Node.js, Express.js
- **API Client:** Axios (fetching data from GitHub REST API v3)
- **Database:** MySQL (mysql2/promise client)
- **Deployment:** Vercel
---
## Database Schema
Run the following query in your MySQL client to set up the database and table:
```sql
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
```
---
## Local Setup & Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/m-vishnu-dev/GitHub-Profile-Analyzer-API.git
   cd GitHub-Profile-Analyzer-API
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=github_analyzer
   DB_PORT=3306
   GITHUB_API_URL=https://api.github.com
   GITHUB_TOKEN=your_github_personal_access_token
   ```
4. **Start the local server:**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000`.
---
## API Reference
### 1. Analyze and Store a Profile
Fetches raw data from GitHub, calculates metrics, and upserts them into the database.
- **Method:** `POST`
- **Path:** `/api/profiles/:username`
- **Example request:**
  `POST https://git-hub-profile-analyzer-api-mu.vercel.app/api/profiles/m-vishnu-dev`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Profile analyzed and stored successfully.",
    "data": {
      "github_username": "m-vishnu-dev",
      "insights": {
        "total_stars": 12,
        "total_forks": 5,
        "account_age_years": 4.12
      },
      "languages": {
        "JavaScript": 8,
        "HTML": 2,
        "CSS": 1
      }
    }
  }
  ```
---
### 2. Fetch All Analyzed Profiles
Reads from the database and returns a summary list of all analyzed profiles.
- **Method:** `GET`
- **Path:** `/api/profiles`
- **Example request:**
  `GET https://git-hub-profile-analyzer-api-mu.vercel.app/api/profiles`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "github_username": "m-vishnu-dev",
        "full_name": "Vishnu Dev",
        "public_repos": 11,
        "total_stars": 12,
        "updated_at": "2026-06-12T10:00:00.000Z"
      },
      {
        "github_username": "octocat",
        "full_name": "The Octocat",
        "public_repos": 8,
        "total_stars": 512,
        "updated_at": "2026-06-11T23:30:00.000Z"
      }
    ]
  }
  ```
---
### 3. Fetch a Single Stored Profile
Retrieves the complete cached analysis metrics for a user directly from the database without querying GitHub again.
- **Method:** `GET`
- **Path:** `/api/profiles/:username`
- **Example request:**
  `GET https://git-hub-profile-analyzer-api-mu.vercel.app/api/profiles/m-vishnu-dev`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "github_username": "m-vishnu-dev",
      "full_name": "Vishnu Dev",
      "bio": "Software Engineer & open source enthusiast.",
      "public_repos": 11,
      "followers": 48,
      "following": 32,
      "total_stars": 12,
      "total_forks": 5,
      "account_age_years": 4.12,
      "created_at": "2026-06-12T10:00:00.000Z",
      "updated_at": "2026-06-12T10:00:00.000Z",
      "top_languages": [
        { "language_name": "JavaScript", "repo_count": 8 },
        { "language_name": "HTML", "repo_count": 2 },
        { "language_name": "CSS", "repo_count": 1 }
      ]
    }
  }
  ```
