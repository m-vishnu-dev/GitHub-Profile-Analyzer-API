const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { errorHandler } = require('./middlewares/errorMiddleware');

// Routes
const authRoutes = require('./routes/authRoutes');
const githubRoutes = require('./routes/githubRoutes');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/github', githubRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
