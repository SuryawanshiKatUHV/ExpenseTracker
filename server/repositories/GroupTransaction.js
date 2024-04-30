const Joi = require("joi");
const {execute, getConnection} = require('../common/database');
const transactionRepo = require("./Transaction");

// SQL Queries
const GET_ALL_SQL =
  `SELECT 
    USER_GROUP_TRANSACTION_ID, 
    USER_GROUP_ID, 
    TRANSACTION_ID,
	  PAID_BY_USER_ID, 
    CONCAT(U1.USER_LNAME, ', ', U1.USER_FNAME) AS PAID_BY_USER_FULLNAME,
	  PAID_TO_USER_ID, 
    CONCAT(U2.USER_LNAME, ', ', U2.USER_FNAME) AS PAID_TO_USER_FULLNAME,
    USER_GROUP_TRANSACTION_DATE, 
    USER_GROUP_TRANSACTION_AMOUNT, 
    USER_GROUP_TRANSACTION_NOTES
    FROM USER_GROUP_TRANSACTION
      JOIN USER u1 on USER_GROUP_TRANSACTION.PAID_BY_USER_ID = u1.USER_ID
      JOIN USER u2 on USER_GROUP_TRANSACTION.PAID_TO_USER_ID = u2.USER_ID`;

const GET_BY_ID_SQL = 
  ` ${GET_ALL_SQL}
      WHERE USER_GROUP_TRANSACTION_ID=?`;

const INSERT_SQL = 
  `INSERT INTO USER_GROUP_TRANSACTION (
    USER_GROUP_ID, 
    TRANSACTION_ID, 
    PAID_BY_USER_ID, 
    PAID_TO_USER_ID, 
    USER_GROUP_TRANSACTION_DATE, 
    USER_GROUP_TRANSACTION_AMOUNT, 
    USER_GROUP_TRANSACTION_NOTES) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

/**
 * Class representing a Group Transaction Model.
 */
class GroupTransaction {

  async getAll() {
    return await execute(GET_ALL_SQL, []);
  }

  async getById(id) {
    const [rows] = await execute(GET_BY_ID_SQL, [id]);
    if (!rows || rows.length === 0) {
      throw new Error(`No group transaction found for id ${id}`);
    }
    return rows[0];
  }

  /**
   * Create a new group transaction.
   * @param {number} USER_GROUP_ID - The user group ID.
   * @param {number} CATEGORY_ID - The category ID.
   * @param {string} TRANSACTION_DATE - The transaction date.
   * @param {number} TRANSACTION_AMOUNT - The transaction amount.
   * @param {string} TRANSACTION_NOTES - The transaction notes.
   * @param {number} PAID_BY_USER_ID - The ID of the user who paid for the transaction.
   * @param {Array<number>} PAID_TO_USER_IDS - The IDs of the users who the transaction was split with.
   * @returns {Promise<Object>} An object containing the transaction ID and the IDs of the created group transactions.
   */
  async create({USER_GROUP_ID, CATEGORY_ID, TRANSACTION_DATE, TRANSACTION_AMOUNT, TRANSACTION_NOTES, PAID_BY_USER_ID, PAID_TO_USER_IDS}) {
    this._validate({USER_GROUP_ID, CATEGORY_ID, TRANSACTION_DATE, TRANSACTION_AMOUNT, TRANSACTION_NOTES, PAID_BY_USER_ID, PAID_TO_USER_IDS});

    const connection = await getConnection();
    try {

      await connection.beginTransaction();
      try {

        console.log(`Creating main transaction...`);
        // First insert the main transaction
        const TRANSACTION_TYPE = "Expense";
        const result = await connection.execute("INSERT INTO TRANSACTION (CATEGORY_ID, TRANSACTION_TYPE, TRANSACTION_DATE, TRANSACTION_AMOUNT, TRANSACTION_NOTES) VALUES (?, ?, ?, ?, ?)", 
        [CATEGORY_ID, TRANSACTION_TYPE, TRANSACTION_DATE, TRANSACTION_AMOUNT, TRANSACTION_NOTES]);
        console.log(`result=${JSON.stringify(result)}`);

        // Secondly insert the devided group transactions
        const TRANSACTION_ID = result[0].insertId;
        const USER_GROUP_TRANSACTION_DATE = TRANSACTION_DATE;
        const USER_GROUP_TRANSACTION_AMOUNT = TRANSACTION_AMOUNT / PAID_TO_USER_IDS.length;
        const USER_GROUP_TRANSACTION_NOTES = TRANSACTION_NOTES;
        const USER_GROUP_TRANSACTION_IDS = [];

        for (const PAID_TO_USER_ID of PAID_TO_USER_IDS) {
          const result = await connection.execute(INSERT_SQL,
              [USER_GROUP_ID, TRANSACTION_ID, PAID_BY_USER_ID, PAID_TO_USER_ID, USER_GROUP_TRANSACTION_DATE, USER_GROUP_TRANSACTION_AMOUNT, USER_GROUP_TRANSACTION_NOTES]);
          USER_GROUP_TRANSACTION_IDS.push(result[0].insertId);
          console.log(`Group transaction inserted with id ${result[0].insertId}`);
        }

        await connection.commit();

        return {TRANSACTION_ID, USER_GROUP_TRANSACTION_IDS};
      }
      catch(error) {
        await connection.rollback();
        throw error;
      }
    }
    finally {
      connection.release();
    }
  }

  /**
   * Validate the group transaction data.
   * @param {Object} groupTransactionData - The group transaction data.
   * @throws {Error} If the data is invalid.
   * @private
   */
  _validate(groupTransactionData) {
    const schema = Joi.object({
      USER_GROUP_ID: Joi.number().required(),
      CATEGORY_ID: Joi.number().required(),
      TRANSACTION_DATE: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
      TRANSACTION_AMOUNT: Joi.number().min(0).required(),
      TRANSACTION_NOTES: Joi.string().required(),
      PAID_BY_USER_ID: Joi.number().required(),
      PAID_TO_USER_IDS: Joi.array().items(Joi.number()).min(1).required()
    });

    const validateResult = schema.validate(groupTransactionData);
    if (validateResult.error) {
      console.log(validateResult.error);
      throw validateResult.error;
    }
  }
}

module.exports = new GroupTransaction();
