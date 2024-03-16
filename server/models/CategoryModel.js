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

  create(categoryData) {
      return new Promise((resolve, reject) => {
          // Assuming there's a simple validation function for category data
          this._validate(categoryData);
  
          const sql = "INSERT INTO CATEGORY (OWNER_ID, CATEGORY_TITLE, CATEGORY_DESCRIPTION) VALUES (?, ?, ?)";
          connectionPool.query(sql, [categoryData.OWNER_ID, categoryData.CATEGORY_TITLE, categoryData.CATEGORY_DESCRIPTION], (error, result) => {
              if (error) {
                  reject(error);
              } 
                  
                  const sql = "SELECT * FROM CATEGORY WHERE OWNER_ID = ?";
                  connectionPool.query(sql, [categoryData.OWNER_ID], (error, result) => {
                      if (error) {
                          reject(error);
                      } else {
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

  _validate(user) {
    const schema = Joi.object({
      OWNER_ID: Joi.number().required(),
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
