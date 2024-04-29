const Joi = require("joi");
const getConnection = require('../common/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Class representing a User Model.
 */
class User {

  /**
   * Get all users.
   *
   * @returns {Promise<Array>} An array of user objects.
   */
  async getAll() {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute("SELECT * FROM USER", []);
      return rows;
    }
    finally {
      connection.release();
    }
  }

  /**
   * Get a user by ID.
   *
   * @param {number} id - The user ID.
   * @returns {Promise<Object>} The user object.
   * @throws {Error} If the user is not found.
   */
  async getById(id) {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute("SELECT * FROM USER WHERE USER_ID=?", [id]);
      if (!rows || rows.length == 0) {
        throw new Error(`No user found for id ${id}`);
      }

      return rows[0];
    }
    finally {
      connection.release();
    }
  }

  /**
   * Create a new user.
   *
   * @param {{USER_EMAIL: string, USER_FNAME: string, USER_LNAME: string, USER_PASSWORD: string}} userData - The user data.
   * @returns {Promise<Object>} An object containing the new user's ID.
   * @throws {Error} If the data is not valid.
   */
  async create({USER_EMAIL, USER_FNAME, USER_LNAME, USER_PASSWORD}) {
    const connection = await getConnection();
    try {
      this._validate({USER_EMAIL, USER_FNAME, USER_LNAME, USER_PASSWORD});
      USER_PASSWORD = await bcrypt.hash(USER_PASSWORD, 10);

      const result = await connection.execute("INSERT INTO USER (USER_EMAIL, USER_FNAME, USER_LNAME, USER_PASSWORD) VALUES (?, ?, ?, ?)", [USER_EMAIL, USER_FNAME, USER_LNAME, USER_PASSWORD]);
      console.log(`User inserted with id ${result[0].insertId}`);

      return {USER_ID:result[0].insertId};
    }
    finally {
      connection.release();
    }
  }

  /**
   * Log in a user.
   *
   * @param {{USER_EMAIL: string, USER_PASSWORD: string}} credentials - The user credentials.
   * @returns {Promise<Object>} The user object with a token.
   * @throws {Error} If the email is not found or the password is incorrect.
   */
  async login({ USER_EMAIL, USER_PASSWORD }) {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute("SELECT * FROM USER WHERE LOWER(USER_EMAIL)=LOWER(?)", [USER_EMAIL]);
      if (!rows || rows.length == 0) {
        throw new Error(`User account with this email does not exist.`);
      }
      const user = rows[0];

      const comparison = await bcrypt.compare(USER_PASSWORD, user.USER_PASSWORD);
      if (comparison === false) {
        throw new Error(`Authentication failed.`);
      }

      const token = jwt.sign({ USER_ID: user.USER_ID }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log(`Login token generated ${token}`);
      // When password is matched, then return the user record as successful login signal
      // also send the json web token.
      // The client stores the token locally (e.g., in localStorage or sessionStorage) and 
      // includes it in the Authorization header for subsequent requests that require authentication.
      user.token = token;

      return user;
    }
    finally {
      connection.release();
    }
  }

  /**
   * Update a user.
   *
   * @param {number} id - The user ID.
   * @param {{USER_FNAME: string, USER_LNAME: string}} userData - The new user data.
   * @returns {Promise<Object>} The result of the update operation.
   * @throws {Error} If the user is not found.
   */
  async update(id, { USER_FNAME, USER_LNAME }) {
    const connection = await getConnection();
    try {
      const result = await connection.execute("UPDATE USER SET USER_FNAME=?, USER_LNAME=? WHERE USER_ID=?", [USER_FNAME, USER_LNAME, id]);
  
      if (result.affectedRows === 0) {
        throw new Error(`No user found for id ${id}`);
      }
  
      return result;
    } finally {
      connection.release();
    }
  }

  /**
   * Delete a user.
   *
   * @param {number} id - The user ID.
   * @returns {Promise<Object>} The result of the delete operation.
   * @throws {Error} If the user is not found.
   */
  async delete(id) {
    const connection = await getConnection();
    try {
      const result = await connection.execute("DELETE FROM USER WHERE USER_ID=?", [id]);
  
      if (result.affectedRows === 0) {
        throw new Error(`No user found for id ${id}`);
      }
  
      return result;
    } finally {
      connection.release();
    }
  }

  async getCategories(userId) {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute(
        `SELECT C.*, COALESCE(T.TOTAL_TRANSACTIONS, 0) AS TOTAL_TRANSACTIONS, COALESCE(B.TOTAL_BUDGETS, 0) AS TOTAL_BUDGETS
        FROM CATEGORY C
          LEFT JOIN (
          SELECT CATEGORY_ID, COUNT(*) AS TOTAL_TRANSACTIONS
              FROM TRANSACTION
              GROUP BY CATEGORY_ID
          ) T ON T.CATEGORY_ID = C.CATEGORY_ID
          LEFT JOIN (
          SELECT CATEGORY_ID, COUNT(*) AS TOTAL_BUDGETS
              FROM BUDGET
              GROUP BY CATEGORY_ID
          ) B ON B.CATEGORY_ID = C.CATEGORY_ID
          WHERE C.OWNER_ID = ?
          ORDER BY C.CATEGORY_TITLE ASC;`, [userId]);
      return rows;
    }
    finally {
      connection.release();
    }
  }

  async getBudgets(userId) {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute(
        `SELECT C.CATEGORY_ID, C.CATEGORY_TITLE, B.BUDGET_ID, B.BUDGET_AMOUNT, DATE_FORMAT(B.BUDGET_DATE, '%m/%d/%Y') AS BUDGET_DATE
        FROM USER U
        JOIN CATEGORY C ON U.USER_ID = C.OWNER_ID
        JOIN BUDGET B ON C.CATEGORY_ID = B.CATEGORY_ID
        WHERE U.USER_ID = ?
        ORDER BY C.CATEGORY_TITLE ASC, B.BUDGET_DATE DESC;`, [userId]);
      return rows;
    }
    finally {
      connection.release();
    }
  }

  async getTransactions(userId) {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute(
        `SELECT 
          C.CATEGORY_ID, 
          C.CATEGORY_TITLE, 
          T.TRANSACTION_ID, 
          T.TRANSACTION_TYPE, 
          T.TRANSACTION_AMOUNT, 
          T.TRANSACTION_NOTES, 
          DATE_FORMAT(T.TRANSACTION_DATE, '%m/%d/%Y') AS TRANSACTION_DATE, 
          COALESCE(UGT.num_user_group_transactions, 0) AS TOTAL_USER_GROUP_TRANSACTIONS
        FROM TRANSACTION T
        JOIN CATEGORY C ON T.CATEGORY_ID = C.CATEGORY_ID
        LEFT JOIN (
          SELECT TRANSACTION_ID, COUNT(*) AS num_user_group_transactions
          FROM USER_GROUP_TRANSACTION
          GROUP BY TRANSACTION_ID
        ) UGT ON T.TRANSACTION_ID = UGT.TRANSACTION_ID
      WHERE C.OWNER_ID=?
      ORDER BY T.TRANSACTION_DATE DESC;`, [userId]);
      return rows;
    }
    finally {
      connection.release();
    }
  }

  async getTransactionsByMonth(userId, year, month) {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute(
        `SELECT C.CATEGORY_ID, C.CATEGORY_TITLE, T.TRANSACTION_ID, T.TRANSACTION_TYPE, T.TRANSACTION_AMOUNT, T.TRANSACTION_NOTES, DATE_FORMAT(T.TRANSACTION_DATE, '%m/%d/%Y') AS TRANSACTION_DATE, COALESCE(UGT.num_user_group_transactions, 0) AS TOTAL_USER_GROUP_TRANSACTIONS
        FROM TRANSACTION T
        JOIN CATEGORY C ON T.CATEGORY_ID = C.CATEGORY_ID
        LEFT JOIN (
          SELECT TRANSACTION_ID, COUNT(*) AS num_user_group_transactions
          FROM USER_GROUP_TRANSACTION
          GROUP BY TRANSACTION_ID
        ) UGT ON T.TRANSACTION_ID = UGT.TRANSACTION_ID
      WHERE C.OWNER_ID=? AND YEAR(T.TRANSACTION_DATE) = ? AND MONTH(T.TRANSACTION_DATE) = ?
      ORDER BY T.TRANSACTION_DATE DESC;`, [userId, year, month]);
      
      return rows;
    }
    finally {
      connection.release();
    }
  }

  async getGroups(userId) {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute(
        `SELECT 
            UG.USER_GROUP_ID, 
            UG.OWNER_ID,
            CONCAT(U.USER_LNAME, ', ', U.USER_FNAME) AS OWNER_NAME,
            DATE_FORMAT(UG.USER_GROUP_DATE, '%m/%d/%Y') AS USER_GROUP_DATE,
            UG.USER_GROUP_TITLE,
            UG.USER_GROUP_DESCRIPTION,
            COALESCE(UGT.TOTAL_USER_GROUP_TRANSACTIONS, 0) AS TOTAL_USER_GROUP_TRANSACTIONS
          FROM USER_GROUP UG
          JOIN USER U 
            ON U.USER_ID = UG.OWNER_ID
          JOIN USER_GROUP_MEMBERSHIP UGM 
            ON UG.USER_GROUP_ID = UGM.USER_GROUP_ID
          LEFT JOIN (
              SELECT USER_GROUP_ID, COUNT(*) AS TOTAL_USER_GROUP_TRANSACTIONS
              FROM USER_GROUP_TRANSACTION
              GROUP BY USER_GROUP_ID
            ) UGT 
            ON UG.USER_GROUP_ID = UGT.USER_GROUP_ID
          WHERE UGM.MEMBER_ID = ?
          ORDER BY UG.USER_GROUP_DATE DESC, UG.USER_GROUP_TITLE ASC`, 
      [userId]);

      return rows;
    }
    finally {
      connection.release();
    }
  }

  async getGroupTransactionsPaid(userId, groupId) {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute(
        `SELECT 
          UGT.*, 
          CONCAT(U1.USER_LNAME, ", ", U1.USER_FNAME) AS PAID_BY_USER_FULLNAME, 
          CONCAT(U2.USER_LNAME, ", ", U2.USER_FNAME) AS PAID_TO_USER_FULLNAME, 
          UG.USER_GROUP_DATE, 
          UG.USER_GROUP_TITLE
        FROM USER_GROUP_TRANSACTION UGT
        JOIN USER U1 ON UGT.PAID_BY_USER_ID=U1.USER_ID
        JOIN USER U2 ON UGT.PAID_TO_USER_ID=U2.USER_ID
        JOIN USER_GROUP UG ON UGT.USER_GROUP_ID=UG.USER_GROUP_ID
        WHERE UGT.PAID_BY_USER_ID=? AND UGT.USER_GROUP_ID=?
        ORDER BY UGT.USER_GROUP_TRANSACTION_DATE DESC`, [userId, groupId]);
      return rows;
    }
    finally {
      connection.release();
    }
  }

  async getGroupTransactionsReceived(userId, groupId) {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute(
        `SELECT UGT.*, CONCAT(U1.USER_LNAME, ", ", U1.USER_FNAME) AS PAID_BY_USER_FULLNAME, CONCAT(U2.USER_LNAME, ", ", U2.USER_FNAME) AS PAID_TO_USER_FULLNAME, UG.USER_GROUP_DATE, UG.USER_GROUP_TITLE
        FROM USER_GROUP_TRANSACTION UGT
        JOIN USER U1 ON UGT.PAID_BY_USER_ID=U1.USER_ID
        JOIN USER U2 ON UGT.PAID_TO_USER_ID=U2.USER_ID
        JOIN USER_GROUP UG ON UGT.USER_GROUP_ID=UG.USER_GROUP_ID
        WHERE UGT.PAID_TO_USER_ID=? AND UGT.USER_GROUP_ID=?
        ORDER BY UGT.USER_GROUP_TRANSACTION_DATE DESC`, [userId, groupId]);
      return rows;
    }
    finally {
      connection.release();
    }
  }

  async getGroupTransactionsMoneyOwedToMe(userId) {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute(
        `SELECT UGT.PAID_BY_USER_FULLNAME, UGT.PAID_TO_USER_FULLNAME, SUM(UGT.USER_GROUP_TRANSACTION_AMOUNT) AS MONEY_OWED_TO_ME
        FROM (
          SELECT CONCAT(U1.USER_LNAME, ", ", U1.USER_FNAME) AS PAID_BY_USER_FULLNAME, CONCAT(U2.USER_LNAME, ", ", U2.USER_FNAME) AS PAID_TO_USER_FULLNAME, USER_GROUP_TRANSACTION_AMOUNT
          FROM USER_GROUP_TRANSACTION
            JOIN USER U1 ON U1.USER_ID = PAID_BY_USER_ID
            JOIN USER U2 ON U2.USER_ID = PAID_TO_USER_ID
            WHERE PAID_BY_USER_ID != PAID_TO_USER_ID AND PAID_BY_USER_ID=?
        ) UGT
        GROUP BY UGT.PAID_BY_USER_FULLNAME, UGT.PAID_TO_USER_FULLNAME`, 
          [userId]);
      return rows;
    }
    finally {
      connection.release();
    }
  }

  async getGroupTransactionsMoneyINeedToPay(userId) {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute(
        `SELECT UGT.PAID_BY_USER_FULLNAME, UGT.PAID_TO_USER_FULLNAME, SUM(UGT.USER_GROUP_TRANSACTION_AMOUNT) AS MONEY_I_NEED_TO_PAY
        FROM (
          SELECT CONCAT(U1.USER_LNAME, ", ", U1.USER_FNAME) AS PAID_BY_USER_FULLNAME, CONCAT(U2.USER_LNAME, ", ", U2.USER_FNAME) AS PAID_TO_USER_FULLNAME, USER_GROUP_TRANSACTION_AMOUNT
          FROM USER_GROUP_TRANSACTION
            JOIN USER U1 ON U1.USER_ID = PAID_BY_USER_ID
            JOIN USER U2 ON U2.USER_ID = PAID_TO_USER_ID
            WHERE PAID_BY_USER_ID != PAID_TO_USER_ID AND PAID_TO_USER_ID=?
        ) UGT
        GROUP BY UGT.PAID_BY_USER_FULLNAME, UGT.PAID_TO_USER_FULLNAME`, 
          [userId]);
      return rows;
    }
    finally {
      connection.release();
    }
  }

  
  /**
   * Get year month range of the Transactions.
   *
   * @returns {Promise<Array>} An array of objects {year, month}.
   */
  async getTransactionsYearMonthRange(userId) {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute(
        `SELECT DISTINCT YEAR(t.TRANSACTION_DATE) AS Year, MONTH(t.TRANSACTION_DATE) AS Month
        FROM TRANSACTION t
        JOIN CATEGORY c ON t.CATEGORY_ID = c.CATEGORY_ID
        WHERE t.TRANSACTION_DATE IS NOT NULL AND c.OWNER_ID = ?
        ORDER BY Year DESC, Month DESC`, 
        [userId]);
      return rows;
    }
    finally {
      connection.release();
    }
  }

  /**
   * Gets the transaction summary for the user in specific month
   * 
   * @param {number} userId 
   * @param {string} type e.g. Expense, Income
   * @param {number} year 
   * @param {number} month 
   * @returns 
   */
  async getTransactionsSummary(userId, type, year, month) {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute(
        `SELECT C.CATEGORY_TITLE AS Category, B.BUDGET_AMOUNT AS Budget, SUM(T.TRANSACTION_AMOUNT) AS Total
        FROM TRANSACTION T
          JOIN CATEGORY C
          ON C.CATEGORY_ID = T.CATEGORY_ID
        JOIN BUDGET B
          ON C.CATEGORY_ID = B.CATEGORY_ID AND YEAR(B.BUDGET_DATE) = YEAR(T.TRANSACTION_DATE) AND MONTH(B.BUDGET_DATE) = MONTH(T.TRANSACTION_DATE)
        WHERE
          YEAR(T.TRANSACTION_DATE) = ? AND MONTH(T.TRANSACTION_DATE) = ? AND T.TRANSACTION_TYPE = ?  AND C.OWNER_ID = ?
        GROUP BY
          T.TRANSACTION_TYPE, YEAR(T.TRANSACTION_DATE), MONTH(T.TRANSACTION_DATE), C.CATEGORY_TITLE, B.BUDGET_AMOUNT;`, 
        [year, month, type, userId]);

        const trsactionSummary = rows.map((item) => {
          return {
              name:     item.Category, 
              Category: item.Category,
              Budget:   parseFloat(item.Budget), 
              Total:    parseFloat(item.Total)
          };
      });
      return trsactionSummary;
    }
    finally {
      connection.release();
    }
  }


  /**
   * Validate a user.
   *
   * @param {{USER_EMAIL: string, USER_FNAME: string, USER_LNAME: string, USER_PASSWORD: string}} user - The user data.
   * @throws {Error} If the data is not valid.
   * @private
   */
  _validate(user) {
    const schema = Joi.object({
      USER_EMAIL: Joi.string().email().required(),
      USER_FNAME: Joi.string().required().min(3).max(50),
      USER_LNAME: Joi.string().required().min(3).max(50),
      USER_PASSWORD: Joi.string().required().min(3).max(50),
    });

    const validateResult = schema.validate(user);
    if (validateResult.error) {
      console.log(validateResult.error);
      throw new Error(validateResult.error);
    }
  }
}

module.exports = new User();
