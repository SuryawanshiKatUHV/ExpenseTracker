const Joi = require("joi");
const getConnection = require("../database");

class TransactionModel {
  /**
   * Get all groups owned by a user.
   *
   * @param {number} ownerId - The user ID.
   * @returns {Promise<Array>} An array of group objects.
   */
  async getAll(ownerId) {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute("SELECT * FROM TRANSACTION WHERE CATEGORY_ID IN (SELECT CATEGORY_ID FROM CATEGORY WHERE OWNER_ID=?)", [ownerId]);
      return rows;
    }
    finally {
      connection.release();
    }
  }

  async getById(id) {
    throw new Error(`To be implemented`);
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

  async update(id, { key1, key2 }) {
    throw new Error(`To be implemented`);
  }

  async delete(id) {
    throw new Error(`To be implemented`);
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

module.exports = new TransactionModel();
