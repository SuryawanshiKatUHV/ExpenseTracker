const mysql = require('mysql2/promise');

// Initialize MySQL connection pool
const connectionPool = mysql.createPool({
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root123',
  database: process.env.DB_NAME || 'expense_tracker',
});

async function execute(sql, params) {
  const connection = await connectionPool.getConnection();
  try {
    return await connection.execute(sql, params);
  } catch (error) {
    console.error(`Database error: ${error.message}`);
    throw error;
  } finally {
    connection.release();
  }
}

async function getConnection() {
  const connection = await connectionPool.getConnection();
  return connection;
}

// Export a function that returns a Promise that resolves to a connection from the pool
module.exports = {execute, getConnection};
