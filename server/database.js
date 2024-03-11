const mysql = require('mysql2');

// Initialize MySQL connection pool
const connectionPool = mysql.createPool({
    connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root123',
    database: process.env.DB_NAME || 'expense_tracker'
  });
  
  module.exports = connectionPool;