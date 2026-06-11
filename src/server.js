require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 5000;

// Test DB Connection before starting the server
pool.getConnection()
  .then((connection) => {
    console.log('Database connected successfully');
    connection.release();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database', error);
    process.exit(1);
  });
