const Joi = require("joi");
const getConnection = require('../database');

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
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute("SELECT * FROM CATEGORY ORDER BY CATEGORY_TITLE ASC", []);
      return rows;
    }
    finally {
      connection.release();
    }
  }

  /**
   * Get a category by ID.
   *
   * @param {number} id - The category ID.
   * @returns {Promise<Object>} The category object.
   * @throws {Error} If the category is not found.
   */
  async getById(id) {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute("SELECT * FROM CATEGORY WHERE CATEGORY_ID=?", [id]);
      if (!rows || rows.length == 0) {
        throw new Error(`No category found for id ${id}`);
      }

      return rows[0];
    }
    finally {
      connection.release();
    }
  }

  /**
   * Create a new category.
   *
   * @param {{OWNER_ID: number, CATEGORY_TITLE: string, CATEGORY_DESCRIPTION: string}} categoryData - The category data.
   * @returns {Promise<Object>} An object containing the new category's ID.
   * @throws {Error} If the data is not valid.
   */
  async create({OWNER_ID, CATEGORY_TITLE, CATEGORY_DESCRIPTION}) {
    const connection = await getConnection();
    try {
      this._validate({OWNER_ID, CATEGORY_TITLE, CATEGORY_DESCRIPTION});

      const result = await connection.execute("INSERT INTO CATEGORY (OWNER_ID, CATEGORY_TITLE, CATEGORY_DESCRIPTION) VALUES (?, ?, ?)", [OWNER_ID, CATEGORY_TITLE, CATEGORY_DESCRIPTION]);
      console.log(`Category inserted with id ${result[0].insertId}`);

      return {CATEGORY_ID:result[0].insertId};
    }
    finally {
      connection.release();
    }
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
    const connection = await getConnection();
    try {
      const result = await connection.execute("UPDATE CATEGORY SET CATEGORY_TITLE=?, CATEGORY_DESCRIPTION=? WHERE CATEGORY_ID=?", [CATEGORY_TITLE, CATEGORY_DESCRIPTION, id]);
  
      if (result.affectedRows === 0) {
        throw new Error(`No category found for id ${id}`);
      }
  
      return result;
    } finally {
      connection.release();
    }
  }

   /**
   * Delete a category.
   *
   * @param {number} id - The category ID.
   * @returns {Promise<Object>} The result of the delete operation.
   * @throws {Error} If the category is not found.
   */
  async delete(id) {
    const connection = await getConnection();
    try {
      const result = await connection.execute("DELETE FROM CATEGORY WHERE CATEGORY_ID=?", [id]);
  
      if (result.affectedRows === 0) {
        throw new Error(`No category found for id ${id}`);
      }
  
      return result;
    } finally {
      connection.release();
    }
  }

  /**
   * Get transactions for a category.
   *
   * @param {number} id - The category ID.
   * @returns {Promise<Array>} An array of transaction objects.
   */
  async getTransactions(id) {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute("SELECT * FROM TRANSACTION WHERE CATEGORY_ID=?", [id]);
      return rows;
    }
    finally {
      connection.release();
    }
  }

   /**
   * Get budgets for a category.
   *
   * @param {number} id - The category ID.
   * @returns {Promise<Array>} An array of budget objects.
   */
  async getBudgets(id) {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute("SELECT * FROM BUDGET WHERE CATEGORY_ID=?", [id]);
      return rows;
    }
    finally {
      connection.release();
    }
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
