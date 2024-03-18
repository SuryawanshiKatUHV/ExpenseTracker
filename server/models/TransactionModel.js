const Joi = require("joi");
const connectionPool = require("../database");

class TransactionModel {
  dummyData = [
  ];
  idCounter = this.dummyData.length;

  getAll() {
    return this.dummyData;
  }

  getById(id) {
    throw { message: `To be implemented` };
  }

  // CATEGORY_ID INT NOT NULL,
  // TRANSACTION_TYPE ENUM('Expense', 'Income') NOT NULL,
  // TRANSACTION_DATE DATETIME NOT NULL,
  // TRANSACTION_AMOUNT DECIMAL(10,2) DEFAULT 0.00,
  // TRANSACTION_NOTES VARCHAR(100),
  create(transactionData) {
    return new Promise((resolve, reject) => {
      this._validate(transactionData);

      const sql = "INSERT INTO TRANSACTION (CATEGORY_ID, TRANSACTION_TYPE, TRANSACTION_DATE, TRANSACTION_AMOUNT, TRANSACTION_NOTES) VALUES (?, ?, ?, ?, ?)";
      connectionPool.query(sql, [transactionData.CATEGORY_ID, transactionData.TRANSACTION_TYPE, transactionData.TRANSACTION_DATE, transactionData.TRANSACTION_AMOUNT, transactionData.TRANSACTION_NOTES], (error, result) => {
        if (error) {
          reject(error);
        }

        const sql = "SELECT * FROM TRANSACTION WHERE CATEGORY_ID=? AND TRANSACTION_TYPE=? AND TRANSACTION_DATE=? AND TRANSACTION_AMOUNT=? AND TRANSACTION_NOTES=?";
        connectionPool.query(sql, [transactionData.CATEGORY_ID, transactionData.TRANSACTION_TYPE, transactionData.TRANSACTION_DATE, transactionData.TRANSACTION_AMOUNT, transactionData.TRANSACTION_NOTES], (error, result) => {

          if (error) {
            reject(error);
          }
          else {
            resolve(result[0]);
          }
        });
      });
    });
  }

  update(id, { key1, key2 }) {
    throw { message: `To be implemented` };
  }

  delete(id) {
    throw { message: `To be implemented` };
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
