const Joi = require("joi");
const connectionPool = require('../database');

class UserModel {

  getAll() {
    return new Promise((resolve, reject) => {
      const sql = "SELECT USER_ID, USER_EMAIL, USER_FNAME, USER_LNAME FROM USER";
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
    return new Promise((resolve, reject) => {
      const sql = "SELECT USER_ID, USER_EMAIL, USER_FNAME, USER_LNAME FROM USER WHERE USER_ID=?";
      connectionPool.query(sql, [id], (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve (result);
        }
      });
    });
  }

  create(userData) {
    return new Promise((resolve, reject) => {
      this._validate(userData);

      const sql = "INSERT INTO USER (USER_EMAIL, USER_FNAME, USER_LNAME, USER_PASSWORD) VALUES (?, ?, ?, ?)";
      connectionPool.query(sql, [userData.USER_EMAIL, userData.USER_FNAME, userData.USER_LNAME, userData.USER_PASSWORD], (error, result) => {
        if (error) {
          reject(error);
        }

        const sql = "SELECT * FROM USER WHERE USER_EMAIL=?";
        connectionPool.query(sql, [userData.USER_EMAIL], (error, result) => {

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

  login({ USER_EMAIL, USER_PASSWORD }) {
    return new Promise((resolve, reject)=>{

      const sql = "SELECT * FROM USER WHERE LOWER(USER_EMAIL)=LOWER(?) AND USER_PASSWORD=?";
      connectionPool.query(sql, [USER_EMAIL, USER_PASSWORD], (error, result) => {
        console.log(`result.length ${result.length}`);
        if (error) {
          reject(error);
        }
        else if (result.length == 0) {
          reject(new Error(`Authentication failed. Login denied.`));
        }
        else {
          // For security reason mask the password
          result[0].USER_PASSWORD = "*****";
          resolve(result[0]);
        }
      });
    });
  }

  update(id, { USER_FNAME, USER_LNAME }) {
    return new Promise((resolve, reject) => {
      this.getById(id)
      .then(result => {
        if(result.length == 0) {
          throw new Error(`No record found for id ${id}`);
        }
        
        const sql = "UPDATE USER SET USER_FNAME=?, USER_LNAME=? WHERE USER_ID=?";
        connectionPool.query(sql, [USER_FNAME, USER_LNAME, id], (error, result) => {
          if (error) {
            reject(error);
          }
          else {
            resolve(result);
          }
        });
      })
      .catch(error => {
        reject(error);
      });
    });
    
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      this.getById(id)
      .then(result => {
        if(result.length == 0) {
          throw new Error(`No record found for id ${id}`);
        }
        
        const sql = "DELETE FROM USER WHERE USER_ID=?";
        connectionPool.query(sql, [id], (error, result) => {
          if (error) {
            reject(error);
          }
          else {
            resolve(result);
          }
        });
      })
      .catch(error => {
        reject(error);
      });
    });
  }

  _validate(user) {
    const schema = Joi.object({
      USER_EMAIL: Joi.string().required().min(3).max(50),
      USER_FNAME: Joi.string().required().min(3).max(50),
      USER_LNAME: Joi.string().required().min(3).max(50),
      USER_PASSWORD: Joi.string().required().min(3).max(50),
    });

    const validateResult = schema.validate(user);
    if (validateResult.error) {
      console.log(validateResult.error);
      throw new Error(validateResult.error);
    }
  }
}

module.exports = new UserModel();
