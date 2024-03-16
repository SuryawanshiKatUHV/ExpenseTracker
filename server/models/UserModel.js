const Joi = require("joi");
const connectionPool = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

      // Hash the password
      bcrypt.hash(userData.USER_PASSWORD, 10, (err, hash) => {
        if (err) {
          reject(err);
        }
        else {
          console.log(`hash=${hash}`);
          userData.USER_PASSWORD = hash;

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
        }
      });
    });
  }

  login({ USER_EMAIL, USER_PASSWORD }) {
    return new Promise((resolve, reject)=>{

      const sql = "SELECT * FROM USER WHERE LOWER(USER_EMAIL)=LOWER(?)";
      connectionPool.query(sql, [USER_EMAIL], (error, result) => {
        console.log(`error=${error}`);
        console.log(`result=${result}`);

        if (error) {
          reject(error);
        }
        else if (result) {
          console.log(`result.length ${result.length}`);
          if (result.length == 0) {
            reject(new Error(`User account with this email does not exist.`));
          }
          else {
            // Compare the encrypted password
            bcrypt.compare(USER_PASSWORD, result[0].USER_PASSWORD, (err, comparison) => {
              if (err) {
                reject(err);
              }
              else if (comparison === false) {
                reject(new Error(`Authentication failed.`));
              }
              else {
                const user = result[0];

                const token = jwt.sign({ USER_ID: user.USER_ID }, process.env.JWT_SECRET, { expiresIn: '1h' });
                console.log(`Login token generated ${token}`);
                // When password is matched, then return the user record as successful login signal
                // also send the json web token.
                // The client stores the token locally (e.g., in localStorage or sessionStorage) and 
                // includes it in the Authorization header for subsequent requests that require authentication.
                user.token = token;
                resolve(user);
              }
            });
          }
        }
        else {
          reject(new Error(`The query result is undefined.`));
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
