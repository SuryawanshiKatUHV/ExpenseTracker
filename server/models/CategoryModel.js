const Joi = require("joi");
const getConnection = require('../database');

class CategoryModel {

  async getAll(ownerId) {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute("SELECT * FROM CATEGORY WHERE OWNER_ID=?", [ownerId]);
      return rows;
    }
    finally {
      connection.release();
    }
  }

  async getById(ownerId, categoryId) {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute("SELECT * FROM CATEGORY WHERE OWNER_ID=? AND CATEGORY_ID=?", [ownerId, categoryId]);
      if (!rows || rows.length == 0) {
        throw new Error(`No category found for id ${categoryId}`);
      }

      return rows[0];
    }
    finally {
      connection.release();
    }
  }

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

  async update(id, { key1, key2 }) {
    throw new Error(`To be implemented`);
  }

  async delete(id) {
    throw new Error(`To be implemented`);
  }

  _validate(user) {
    const schema = Joi.object({
      OWNER_ID: Joi.number().required(),
      CATEGORY_TITLE: Joi.string().required().min(3).max(50),
      CATEGORY_DESCRIPTION: Joi.string().required().min(3).max(100),
    });

    const validateResult = schema.validate(user);
    if (validateResult.error) {
      console.log(validateResult.error);
      throw validateResult.error;
    }
  }
}

module.exports = new CategoryModel();
