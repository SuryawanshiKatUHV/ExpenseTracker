const Joi = require("joi");
const getConnection = require('../common/database');

class Transaction {


  /**
   * Get all Transactions.
   *
   * @returns {Promise<Array>} An array of transaction objects.
   */
  async getAll() {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute("SELECT * FROM TRANSACTION", []);
      return rows;
    }
    finally {
      connection.release();
    }
  }

  /**
   * Get a transaction by ID.
   *
   * @param {number} id - The transaction ID.
   * @returns {Promise<Object>} The transaction object.
   * @throws {Error} If the transaction is not found.
   */
  async getById(id) {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute("SELECT * FROM TRANSACTION WHERE TRANSACTION_ID=?", [id]);
      if (!rows || rows.length == 0) {
        throw new Error(`No transaction found for the id ${id}`);
      }

      return rows[0];
    }
    finally {
      connection.release();
    }
  }

  /**
   * Create a new transaction.
   *
   * @param {{CATEGORY_ID: number, TRANSACTION_TYPE: string, TRANSACTION_DATE: string, TRANSACTION_AMOUNT: number, TRANSACTION_NOTES: string}} transactionData - The transaction data.
   * @returns {Promise<Object>} An object containing the new transaction's ID.
   * @throws {Error} If the data is not valid.
   */
  async create({CATEGORY_ID, TRANSACTION_TYPE, TRANSACTION_DATE, TRANSACTION_AMOUNT, TRANSACTION_NOTES}) {
    const connection = await getConnection();
    try {
      this._validate({CATEGORY_ID, TRANSACTION_TYPE, TRANSACTION_DATE, TRANSACTION_AMOUNT, TRANSACTION_NOTES});

      const result = await connection.execute("INSERT INTO TRANSACTION (CATEGORY_ID, TRANSACTION_TYPE, TRANSACTION_DATE, TRANSACTION_AMOUNT, TRANSACTION_NOTES) VALUES (?, ?, ?, ?, ?)", [CATEGORY_ID, TRANSACTION_TYPE, TRANSACTION_DATE, TRANSACTION_AMOUNT, TRANSACTION_NOTES]);
      console.log(`Transaction inserted with id ${result[0].insertId}`);

      return {TRANSACTION_ID:result[0].insertId};
    }
    finally {
      connection.release();
    }
  }

  /**
   * Update a transaction.
   *
   * @param {number} id - The transaction ID.
   * @param {{TRANSACTION_TYPE: string, CATEGORY_ID:number, TRANSACTION_DATE: Date, TRANSACTION_AMOUNT: Number, TRANSACTION_NOTES: string}} updates - The transaction updates.
   * @returns {Promise<Object>} The result of the update operation.
   * @throws {Error} If the transaction is not found.
   */
  async update(id, { TRANSACTION_TYPE, CATEGORY_ID, TRANSACTION_DATE, TRANSACTION_AMOUNT, TRANSACTION_NOTES }) {
    const connection = await getConnection();
    try {
      const result = await connection.execute("UPDATE TRANSACTION SET TRANSACTION_TYPE=?, CATEGORY_ID=?, TRANSACTION_DATE=?, TRANSACTION_AMOUNT=?, TRANSACTION_NOTES=? WHERE TRANSACTION_ID=?", [TRANSACTION_TYPE, CATEGORY_ID, TRANSACTION_DATE, TRANSACTION_AMOUNT, TRANSACTION_NOTES, id]);
  
      if (result.affectedRows === 0) {
        throw new Error(`No transaction found for id ${id}`);
      }
  
      return result;
    } finally {
      connection.release();
    }
  }

     /**
   * Delete a category.
   *
   * @param {number} id - The transaction ID.
   * @returns {Promise<Object>} The result of the delete operation.
   * @throws {Error} If the transaction is not found.
   */
  async delete(id) {
    const connection = await getConnection();
    try {
      const result = await connection.execute("DELETE FROM TRANSACTION WHERE TRANSACTION_ID=?", [id]);
  
      if (result.affectedRows === 0) {
        throw new Error(`No transaction found for id ${id}`);
      }
  
      return result;
    } finally {
      connection.release();
    }
  }

  /**
   * Validate transaction data.
   *
   * @param {{CATEGORY_ID: number, TRANSACTION_TYPE: string, TRANSACTION_DATE: string, TRANSACTION_AMOUNT: number, TRANSACTION_NOTES: string}} transactionData - The transaction data.
   * @throws {Error} If the data is not valid.
   * @private
   */
  _validate(transactionData) {
    const schema = Joi.object({
      CATEGORY_ID: Joi.number().required(),
      TRANSACTION_TYPE: Joi.string().valid('Expense', 'Income').required(),
      TRANSACTION_DATE: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
      TRANSACTION_AMOUNT: Joi.number().min(0).required(),
      TRANSACTION_NOTES: Joi.string().required()
    });

    const validateResult = schema.validate(transactionData);
    if (validateResult.error) {
      console.log(validateResult.error);
      throw validateResult.error;
    }
  }
}

module.exports = new Transaction();
