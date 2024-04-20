const Joi = require("joi");
const getConnection = require('../common/database');

//interacts with db
class Budget {
  async getAll() {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute("SELECT * FROM BUDGET", []);
      return rows;
    }
    finally {
      connection.release();
    }
  }

  async getById(id) {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute("SELECT * FROM BUDGET WHERE BUDGET_ID=?", [id]);
      if (!rows || rows.length == 0) {
        throw new Error(`No budget found for id ${id}`);
      }

      return rows[0];
    } finally {
      connection.release();
    }
  }

  async create({CATEGORY_ID, BUDGET_DATE, BUDGET_AMOUNT, BUDGET_NOTES}) {
    const connection = await getConnection();
    try {
      this._validate({CATEGORY_ID, BUDGET_DATE, BUDGET_AMOUNT, BUDGET_NOTES});
      console.log(`Budget id inside repo ${CATEGORY_ID}`);
      const result = await connection.execute("INSERT INTO BUDGET (CATEGORY_ID, BUDGET_DATE, BUDGET_AMOUNT, BUDGET_NOTES) VALUES (?, ?, ?, ?)", [CATEGORY_ID, BUDGET_DATE, BUDGET_AMOUNT, BUDGET_NOTES]);
      console.log(`Budget inserted with id ${result[0].insertId}`);

      return { BUDGET_ID: result[0].insertId };
    } finally {
      connection.release();
    }
  }

  async update(id, {BUDGET_DATE, BUDGET_AMOUNT, BUDGET_NOTES}) {
    const connection = await getConnection();
    try {
      const result = await connection.execute("UPDATE BUDGET SET BUDGET_DATE=?, BUDGET_AMOUNT=?, BUDGET_NOTES=? WHERE BUDGET_ID=?", [BUDGET_DATE, BUDGET_AMOUNT, BUDGET_NOTES, id]);

      if (result.affectedRows === 0) {
        throw new Error(`No budget found for id ${id}`);
      }

      return result;
    } finally {
      connection.release();
    }
  }

  async delete(id) {
    const connection = await getConnection();
    try {
      const result = await connection.execute("DELETE FROM BUDGET WHERE BUDGET_ID=?", [id]);

      if (result.affectedRows === 0) {
        throw new Error(`No budget found for id ${id}`);
      }

      return result;
    } finally {
      connection.release();
    }
  }

  _validate(budgetData) {
    const schema = Joi.object({
      CATEGORY_ID: Joi.number().required(),
      BUDGET_DATE: Joi.date().required(),
      BUDGET_AMOUNT: Joi.number().required().min(0),
      BUDGET_NOTES: Joi.string().required().min(3).max(100),
    });

    const validateResult = schema.validate(budgetData);
    if (validateResult.error) {
      console.log(validateResult.error);
      throw validateResult.error;
    }
  }
}

module.exports = new Budget();