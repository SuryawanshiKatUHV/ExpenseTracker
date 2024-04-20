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
        `SELECT * 
        FROM CATEGORY 
        WHERE OWNER_ID=?
        ORDER BY CATEGORY_TITLE ASC`, [userId]);
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
        `SELECT CATEGORY.CATEGORY_ID, CATEGORY.CATEGORY_TITLE, BUDGET.BUDGET_ID, BUDGET.BUDGET_AMOUNT, DATE_FORMAT(BUDGET.BUDGET_DATE, '%m/%d/%Y') AS BUDGET_DATE
        FROM USER
        JOIN CATEGORY ON USER.USER_ID = CATEGORY.OWNER_ID
        JOIN BUDGET ON CATEGORY.CATEGORY_ID = BUDGET.CATEGORY_ID
        WHERE USER.USER_ID = ?;`, [userId]);
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
        `SELECT T.*, C.CATEGORY_TITLE, C.CATEGORY_DESCRIPTION
          FROM TRANSACTION T
          JOIN CATEGORY C ON T.CATEGORY_ID = C.CATEGORY_ID
          WHERE C.OWNER_ID=?
          ORDER BY T.TRANSACTION_DATE DESC`, 
          [userId]);
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
        `SELECT UG.*, DATE_FORMAT(UG.USER_GROUP_DATE, '%Y-%m-%d') AS USER_GROUP_DATE
        FROM USER_GROUP UG
        JOIN USER_GROUP_MEMBERSHIP UGM ON UG.USER_GROUP_ID = UGM.USER_GROUP_ID
        WHERE UGM.MEMBER_ID=?
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
        `SELECT UGT.*, CONCAT(U1.USER_LNAME, ", ", U1.USER_FNAME) AS PAID_BY_USER_FULLNAME, CONCAT(U2.USER_LNAME, ", ", U2.USER_FNAME) AS PAID_TO_USER_FULLNAME, UG.USER_GROUP_DATE, UG.USER_GROUP_TITLE
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
