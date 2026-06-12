const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { errorHandler } = require('./middlewares/errorMiddleware');

// Routes
const profileRoutes = require('./routes/githubRoutes');

const app = express();

// Middlewares
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors());
app.use(express.json());

// Welcome & Documentation Page
app.get('/', (req, res) => {
  const host = req.headers.host || 'localhost:5000';
  const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GitHub Profile Analyzer API</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-color: #0d1117;
      --card-bg: rgba(22, 27, 34, 0.75);
      --card-border: rgba(48, 54, 61, 0.6);
      --text-main: #c9d1d9;
      --text-bright: #f0f6fc;
      --text-muted: #8b949e;
      --accent: #58a6ff;
      --accent-rgb: 88, 166, 255;
      --accent-purple: #bc8cff;
      --accent-green: #3fb950;
      --glow-shadow: 0 0 25px rgba(88, 166, 255, 0.15);
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--bg-color);
      color: var(--text-main);
      line-height: 1.6;
      padding: 3rem 1rem;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      background-image: radial-gradient(circle at 50% 0%, rgba(var(--accent-rgb), 0.12) 0%, transparent 60%);
    }

    .container {
      max-width: 800px;
      width: 100%;
    }

    header {
      text-align: center;
      margin-bottom: 3rem;
      animation: fadeInDown 0.8s ease-out;
    }

    h1 {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--text-bright);
      margin-bottom: 0.5rem;
      letter-spacing: -0.04em;
      background: linear-gradient(135deg, var(--text-bright) 30%, var(--accent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    p.subtitle {
      font-size: 1.05rem;
      color: var(--text-muted);
      max-width: 600px;
      margin: 0 auto;
    }

    .live-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(63, 185, 80, 0.12);
      border: 1px solid rgba(63, 185, 80, 0.25);
      color: var(--accent-green);
      padding: 0.3rem 0.8rem;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-top: 1rem;
      box-shadow: 0 0 15px rgba(63, 185, 80, 0.08);
    }

    .live-pulse {
      width: 8px;
      height: 8px;
      background-color: var(--accent-green);
      border-radius: 50%;
      animation: pulse 1.6s infinite;
    }

    .endpoints {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      animation: fadeInUp 0.8s ease-out 0.2s both;
    }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 1.75rem;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15);
    }

    .card:hover {
      transform: translateY(-4px);
      border-color: rgba(var(--accent-rgb), 0.45);
      box-shadow: var(--glow-shadow), 0 8px 30px rgba(0, 0, 0, 0.25);
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .method-path {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .badge {
      font-size: 0.8rem;
      font-weight: 700;
      padding: 0.25rem 0.55rem;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge.post {
      background: rgba(88, 166, 255, 0.15);
      border: 1px solid rgba(88, 166, 255, 0.3);
      color: var(--accent);
    }

    .badge.get {
      background: rgba(188, 140, 255, 0.15);
      border: 1px solid rgba(188, 140, 255, 0.3);
      color: var(--accent-purple);
    }

    .path {
      font-family: 'Fira Code', monospace;
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--text-bright);
    }

    .desc {
      color: var(--text-muted);
      font-size: 0.95rem;
      margin-bottom: 1.25rem;
    }

    .code-block {
      background: #05070a;
      border: 1px solid rgba(48, 54, 61, 0.35);
      border-radius: 10px;
      padding: 0.9rem 1.1rem;
      font-family: 'Fira Code', monospace;
      font-size: 0.85rem;
      position: relative;
      overflow-x: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .code-text {
      color: #79c0ff;
      white-space: nowrap;
    }

    .copy-btn {
      background: rgba(240, 246, 25c, 0.06);
      border: 1px solid rgba(240, 246, 25c, 0.12);
      color: var(--text-muted);
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.8rem;
      font-weight: 500;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .copy-btn:hover {
      background: rgba(240, 246, 25c, 0.12);
      color: var(--text-bright);
      border-color: rgba(240, 246, 25c, 0.25);
    }

    footer {
      text-align: center;
      margin-top: 4rem;
      color: var(--text-muted);
      font-size: 0.85rem;
      animation: fadeIn 0.8s ease-out 0.4s both;
    }

    footer a {
      color: var(--accent);
      text-decoration: none;
      transition: color 0.2s;
    }

    footer a:hover {
      color: var(--text-bright);
      text-decoration: underline;
    }

    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-15px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes pulse {
      0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(63, 185, 80, 0.4); }
      70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(63, 185, 80, 0); }
      100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(63, 185, 80, 0); }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>GitHub Profile Analyzer</h1>
      <p class="subtitle">A public metrics aggregator API for GitHub profiles and repositories.</p>
      <div class="live-badge">
        <div class="live-pulse"></div>
        API Online
      </div>
    </header>

    <div class="endpoints">
      <!-- Endpoint 1 -->
      <div class="card">
        <div class="card-header">
          <div class="method-path">
            <span class="badge post">POST</span>
            <span class="path">/api/profiles/:username</span>
          </div>
        </div>
        <p class="desc">Triggers the engine to fetch data from GitHub, calculate stats (stars, forks, languages, account age), and store/upsert them in the database.</p>
        <div class="code-block">
          <div class="code-text">curl -X POST ${baseUrl}/api/profiles/m-vishnu-dev</div>
          <button class="copy-btn" onclick="copyText('curl -X POST ${baseUrl}/api/profiles/m-vishnu-dev', this)">Copy</button>
        </div>
      </div>

      <!-- Endpoint 2 -->
      <div class="card">
        <div class="card-header">
          <div class="method-path">
            <span class="badge get">GET</span>
            <span class="path">/api/profiles</span>
          </div>
        </div>
        <p class="desc">Retrieves a summary list of all profiles that have been analyzed and saved to the database.</p>
        <div class="code-block">
          <div class="code-text">curl ${baseUrl}/api/profiles</div>
          <button class="copy-btn" onclick="copyText('curl ${baseUrl}/api/profiles', this)">Copy</button>
        </div>
      </div>

      <!-- Endpoint 3 -->
      <div class="card">
        <div class="card-header">
          <div class="method-path">
            <span class="badge get">GET</span>
            <span class="path">/api/profiles/:username</span>
          </div>
        </div>
        <p class="desc">Retrieves the complete cached statistics and programming language breakdown for a specific user directly from the database.</p>
        <div class="code-block">
          <div class="code-text">curl ${baseUrl}/api/profiles/m-vishnu-dev</div>
          <button class="copy-btn" onclick="copyText('curl ${baseUrl}/api/profiles/m-vishnu-dev', this)">Copy</button>
        </div>
      </div>
    </div>

    <footer>
      Powered by Express & MySQL | Hosted on Vercel | <a href="https://github.com/m-vishnu-dev/GitHub-Profile-Analyzer-API" target="_blank">View GitHub Repo</a>
    </footer>
  </div>

  <script>
    function copyText(text, btn) {
      navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.innerText;
        btn.innerText = 'Copied!';
        setTimeout(() => {
          btn.innerText = originalText;
        }, 1500);
      });
    }
  </script>
</body>
</html>
  `);
});

// Routes
app.use('/api/profiles', profileRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
