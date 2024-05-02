const Joi = require("joi");
const { execute } = require("../common/database");

/**
 * Class representing a Budget and its interactions with the database.
 */
class Budget {
  /**
   * Get all budgets.
   * @returns {Array<Object>} An array of budget objects.
   */
  async getAll() {
    const [rows] = await execute("SELECT * FROM BUDGET", []);
    return rows;
  }

  /**
   * Get a budget by ID.
   * @param {number} id - The ID of the budget.
   * @returns {Object} The budget object with the given ID.
   * @throws {Error} If no budget is found for the given ID.
   */
  async getById(id) {
    const [rows] = await execute("SELECT * FROM BUDGET WHERE BUDGET_ID=?", [id]);
    if (!rows || rows.length === 0) {
      throw new Error(`No budget found for id ${id}`);
    }
    return rows[0];
  }

  /**
   * Create a new budget.
   * @param {{CATEGORY_ID: number, BUDGET_DATE: Date, BUDGET_AMOUNT: number, BUDGET_NOTES: string}} budgetData - The budget data.
   * @returns {{BUDGET_ID: number}} The ID of the created budget.
   * @throws {Error} If the provided budget data is invalid.
   */
  async create(budgetData) {
    this._validate(budgetData);
    const result = await execute(
      "INSERT INTO BUDGET (CATEGORY_ID, BUDGET_DATE, BUDGET_AMOUNT, BUDGET_NOTES) VALUES (?, ?, ?, ?)",
      [budgetData.CATEGORY_ID, budgetData.BUDGET_DATE, budgetData.BUDGET_AMOUNT, budgetData.BUDGET_NOTES]
    );
    return { BUDGET_ID: result[0].insertId };
  }

  /**
   * Update a budget by ID.
   * @param {number} id - The ID of the budget.
   * @param {{BUDGET_DATE: Date, BUDGET_AMOUNT: number, BUDGET_NOTES: string}} budgetData - The updated budget data.
   * @returns {Object} The result of the update operation.
   * @throws {Error} If no budget is found for the given ID.
   */
  async update(id, budgetData) {
    const result = await execute(
      "UPDATE BUDGET SET BUDGET_DATE=?, BUDGET_AMOUNT=?, BUDGET_NOTES=? WHERE BUDGET_ID=?",
      [budgetData.BUDGET_DATE, budgetData.BUDGET_AMOUNT, budgetData.BUDGET_NOTES, id]
    );
    if (result.affectedRows === 0) {
      throw new Error(`No budget found for id ${id}`);
    }
    return result;
  }

  /**
   * Delete a budget by ID.
   * @param {number} id - The ID of the budget.
   * @returns {Object} The result of the delete operation.
   * @throws {Error} If no budget is found for the given ID.
   */
  async delete(id) {
    const result = await execute("DELETE FROM BUDGET WHERE BUDGET_ID=?", [id]);
    if (result.affectedRows === 0) {
      throw new Error(`No budget found for id ${id}`);
    }
    return result;
  }

  /**
   * Validate budget data using Joi schema.
   * @param {{CATEGORY_ID: number, BUDGET_DATE: Date, BUDGET_AMOUNT: number, BUDGET_NOTES: string}} budgetData - The budget data to validate.
   * @throws {Error} If the provided budget data is invalid.
   * @private
   */
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
