require('dotenv').config();
const { Pool } = require('pg');
const app = require('./app');
const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;

//Test ket noi
if (DATABASE_URL) {
  const pool = new Pool({ connectionString: DATABASE_URL });
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Database connection error:', err.message);
    } else {
      console.log('PostgreSQL connected successfully at:', res.rows[0].now);
    }
  });
}

const server = app.listen(PORT, () => {
  console.log(`Azota backend server is running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
