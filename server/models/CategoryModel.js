const Joi = require("joi");
const connectionPool = require('../database');

class CategoryModel {


  getAll() {
    return new Promise((resolve, reject) => {
      const sql = "SELECT OWNER_ID, CATEGORY_TITLE, CATEGORY_DESCRIPTION FROM CATEGORY";
      connectionPool.query(sql, [], (error, result) => {
        if (error) {
          reject (error);
        }
        else {
          resolve(result);
        }
      });
    });
  }

  getById(id) {
    throw { message: `To be implemented` };
  }

  create({ key1, key2 }) {
    throw { message: `To be implemented` };
  }

  update(id, { key1, key2 }) {
    throw { message: `To be implemented` };
  }

  delete(id) {
    throw { message: `To be implemented` };
  }

  _validate(user) {
    const schema = Joi.object({
      CATEGORY_TITLE: Joi.string().required().min(3).max(50),
      CATEGORY_DESCRIPTION: Joi.string().required().min(3).max(50),
    });

    const validateResult = schema.validate(user);
    if (validateResult.error) {
      console.log(validateResult.error);
      throw validateResult.error;
    }
  }
}

module.exports = new CategoryModel();
