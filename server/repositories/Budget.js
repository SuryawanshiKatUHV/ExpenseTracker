const Joi = require("joi");
const {execute} = require('../common/database');

//interacts with db
class Budget {
  async getAll() {
    return await execute("SELECT * FROM BUDGET", []);
  }

  async getById(id) {
    const [rows] = await execute("SELECT * FROM BUDGET WHERE BUDGET_ID=?", [id]);
    if (!rows || rows.length == 0) {
      throw new Error(`No budget found for id ${id}`);
    }
    return rows[0];
  }

  async create({CATEGORY_ID, BUDGET_DATE, BUDGET_AMOUNT, BUDGET_NOTES}) {
    this._validate({CATEGORY_ID, BUDGET_DATE, BUDGET_AMOUNT, BUDGET_NOTES});
    const result = await execute("INSERT INTO BUDGET (CATEGORY_ID, BUDGET_DATE, BUDGET_AMOUNT, BUDGET_NOTES) VALUES (?, ?, ?, ?)", [CATEGORY_ID, BUDGET_DATE, BUDGET_AMOUNT, BUDGET_NOTES]);
    return { BUDGET_ID: result.insertId };
  }

  async update(id, {BUDGET_DATE, BUDGET_AMOUNT, BUDGET_NOTES}) {
    const result = await execute("UPDATE BUDGET SET BUDGET_DATE=?, BUDGET_AMOUNT=?, BUDGET_NOTES=? WHERE BUDGET_ID=?", [BUDGET_DATE, BUDGET_AMOUNT, BUDGET_NOTES, id]);
    if (result.affectedRows === 0) {
      throw new Error(`No budget found for id ${id}`);
    }
    return result;
  }

  async delete(id) {
    const result = await execute("DELETE FROM BUDGET WHERE BUDGET_ID=?", [id]);
    if (result.affectedRows === 0) {
      throw new Error(`No budget found for id ${id}`);
    }
    return result;
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