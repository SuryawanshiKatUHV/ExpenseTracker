const Joi = require("joi");
const getConnection = require("../database");

class TransactionModel {
  async getAll() {
    throw new Error(`To be implemented`);
  }

  async getById(id) {
    throw new Error(`To be implemented`);
  }

  // CATEGORY_ID INT NOT NULL,
  // TRANSACTION_TYPE ENUM('Expense', 'Income') NOT NULL,
  // TRANSACTION_DATE DATETIME NOT NULL,
  // TRANSACTION_AMOUNT DECIMAL(10,2) DEFAULT 0.00,
  // TRANSACTION_NOTES VARCHAR(100),
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

  // CATEGORY_ID INT NOT NULL,
  // TRANSACTION_TYPE ENUM('Expense', 'Income') NOT NULL,
  // TRANSACTION_DATE DATETIME NOT NULL,
  // TRANSACTION_AMOUNT DECIMAL(10,2) DEFAULT 0.00,
  // TRANSACTION_NOTES VARCHAR(100) NOT NULL,
  _validate(transactionData) {
    const schema = Joi.object({
      CATEGORY_ID: Joi.number().required(),
      TRANSACTION_TYPE: Joi.string().required(), //TODO must be from Expense/Income
      TRANSACTION_DATE: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
      TRANSACTION_AMOUNT: Joi.number().required(),//Not negative
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
