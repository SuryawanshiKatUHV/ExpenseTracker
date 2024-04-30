const mysql = require('mysql2/promise');

// Initialize MySQL connection pool
const connectionPool = mysql.createPool({
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root123',
  database: process.env.DB_NAME || 'expense_tracker',
});

/**
 * Executes the given prepared SQL. 
 * Database connection management is done internally.
 * 
 * @param {string} sql Prepared SQL statement
 * @param {string[]} params The parameters to the prepared SQL statement
 * @returns Result of the SQL execution
 */
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
/**
 * Executes the given prepared SQL with given connection object. 
 * This function is useful when the connection's transaction is maintained by client code.
 * 
 * @param {mysql connection} connection The database connection object
 * @param {string} sql Prepared SQL statement
 * @param {string[]} params The parameters to the prepared SQL statement
 * @returns Result of the SQL execution
 */
async function executeUsingConnection(connection, sql, params) {
  try {
    return await connection.execute(sql, params);
  } catch (error) {
    console.error(`Database error: ${error.message}`);
    throw error;
  }
}

/**
 * Gets the datbase connection from the pool
 * 
 * @returns The datbase connection from the pool
 */
async function getConnection() {
  const connection = await connectionPool.getConnection();
  return connection;
}

// Export a function that returns a Promise that resolves to a connection from the pool
module.exports = {execute, executeUsingConnection, getConnection};
