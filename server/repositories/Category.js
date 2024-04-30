const Joi = require("joi");
const {execute} = require('../common/database');

/**
 * Category class to interact with the 'CATEGORY' database table.
 */
class Category {

  /**
   * Get all categories.
   *
   * @returns {Promise<Array>} An array of category objects.
   */
  async getAll() {
    return await execute(
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
      ORDER BY C.CATEGORY_TITLE ASC;`, []);
  }

  /**
   * Get a category by ID.
   *
   * @param {number} id - The category ID.
   * @returns {Promise<Object>} The category object.
   * @throws {Error} If the category is not found.
   */
  async getById(id) {
    const [rows] = await execute(`SELECT C.*, COALESCE(T.TOTAL_TRANSACTIONS, 0) AS TOTAL_TRANSACTIONS, COALESCE(B.TOTAL_BUDGETS, 0) AS TOTAL_BUDGETS
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
        WHERE C.CATEGORY_ID=?
        ORDER BY C.CATEGORY_TITLE ASC;`, [id]);
      if (!rows || rows.length === 0) {
        throw new Error(`No category found for id ${id}`);
      }

      return rows[0];
  }

  /**
   * Create a new category.
   *
   * @param {{OWNER_ID: number, CATEGORY_TITLE: string, CATEGORY_DESCRIPTION: string}} categoryData - The category data.
   * @returns {Promise<Object>} An object containing the new category's ID.
   * @throws {Error} If the data is not valid.
   */
  async create({OWNER_ID, CATEGORY_TITLE, CATEGORY_DESCRIPTION}) {
    this._validate({OWNER_ID, CATEGORY_TITLE, CATEGORY_DESCRIPTION});
    const result = await execute("INSERT INTO CATEGORY (OWNER_ID, CATEGORY_TITLE, CATEGORY_DESCRIPTION) VALUES (?, ?, ?)", [OWNER_ID, CATEGORY_TITLE, CATEGORY_DESCRIPTION]);
    return {CATEGORY_ID:result[0].insertId};
  }

  /**
   * Update a category.
   *
   * @param {number} id - The category ID.
   * @param {{CATEGORY_TITLE: string, CATEGORY_DESCRIPTION: string}} updates - The category updates.
   * @returns {Promise<Object>} The result of the update operation.
   * @throws {Error} If the category is not found.
   */
  async update(id, { CATEGORY_TITLE, CATEGORY_DESCRIPTION }) {
    const result = await execute("UPDATE CATEGORY SET CATEGORY_TITLE=?, CATEGORY_DESCRIPTION=? WHERE CATEGORY_ID=?", [CATEGORY_TITLE, CATEGORY_DESCRIPTION, id]);
    if (result.affectedRows === 0) {
      throw new Error(`No category found for id ${id}`);
    }
    return result;
  }

   /**
   * Delete a category.
   *
   * @param {number} id - The category ID.
   * @returns {Promise<Object>} The result of the delete operation.
   * @throws {Error} If the category is not found.
   */
  async delete(id) {
    // Ensure if this item can be deleted
    const categoryData = await this.getById(id);
    const totalTransactions = parseInt(categoryData.TOTAL_TRANSACTIONS);
    const totalBudgets = parseInt(categoryData.TOTAL_BUDGETS);
    if (totalTransactions > 0 ) {
      throw new Error(`Cannot delete '${categoryData.CATEGORY_TITLE}' category as it has ${totalTransactions} transaction(s).`);
    }
    if (totalBudgets > 0 ) {
      throw new Error(`Cannot delete '${categoryData.CATEGORY_TITLE}' category as it has ${totalBudgets} budget(s).`);
    }

    // Delete this item
    const result = await execute("DELETE FROM CATEGORY WHERE CATEGORY_ID=?", [id]);
    if (result.affectedRows === 0) {
      throw new Error(`No category found for id ${id}`);
    }
    return result;
  }

  /**
   * Get transactions for a category.
   *
   * @param {number} id - The category ID.
   * @returns {Promise<Array>} An array of transaction objects.
   */
  async getTransactions(id) {
    return await execute("SELECT * FROM TRANSACTION WHERE CATEGORY_ID=?", [id]);
  }

   /**
   * Get budgets for a category.
   *
   * @param {number} id - The category ID.
   * @returns {Promise<Array>} An array of budget objects.
   */
  async getBudgets(id) {
    return await execute("SELECT * FROM BUDGET WHERE CATEGORY_ID=?", [id]);
  }

  /**
   * Validate category data.
   *
   * @param {{OWNER_ID: number, CATEGORY_TITLE: string, CATEGORY_DESCRIPTION: string}} categoryData - The category data.
   * @throws {Error} If the data is not valid.
   * @private
   */
  _validate(categoryData) {
    const schema = Joi.object({
      OWNER_ID: Joi.number().required(),
      CATEGORY_TITLE: Joi.string().required().min(3).max(50),
      CATEGORY_DESCRIPTION: Joi.string().required().min(3).max(100),
    });

    const validateResult = schema.validate(categoryData);
    if (validateResult.error) {
      console.log(validateResult.error);
      throw validateResult.error;
    }
  }
}

module.exports = new Category();
