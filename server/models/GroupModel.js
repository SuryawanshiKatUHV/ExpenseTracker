const Joi = require("joi");
const connectionPool = require("../database");

class GroupModel {

  getAll(userId) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM USER_GROUP WHERE USER_GROUP_ID IN (SELECT USER_GROUP_ID FROM USER_GROUP_MEMBERSHIP WHERE MEMBER_ID=?)";
      connectionPool.query(sql, [userId], (error, result) => {
        if(error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
        
    });
  }

  getById(userId, id) {
    throw { message: `To be implemented` };
  }

  // OWNER_ID INT NOT NULL,
  // USER_GROUP_DATE DATETIME NOT NULL,
  // USER_GROUP_TITLE VARCHAR(50) NOT NULL UNIQUE,
  // USER_GROUP_DESCRIPTION VARCHAR(100),
  // USER_GROUP_MEMBERS=[1,2,3]
  create(userGroupData) {
    return new Promise((resolve, reject) => {
      this._validate(userGroupData);

      connectionPool.getConnection((error, connection) => {
        if (error) {
          reject(error);
        }
        else {

          connection.beginTransaction((error) => {
            if (error) {
              connection.release();
              reject(error);
            }
            else {
              console.log(`Transaction started...`);

              const sql = "INSERT INTO USER_GROUP (OWNER_ID, USER_GROUP_DATE, USER_GROUP_TITLE, USER_GROUP_DESCRIPTION) VALUES (?, ?, ?, ?)";
              connection.query(sql, [userGroupData.OWNER_ID, userGroupData.USER_GROUP_DATE, userGroupData.USER_GROUP_TITLE, userGroupData.USER_GROUP_DESCRIPTION], (error, result) => {
                if (error) {
                  connection.rollback(() => {
                    console.log(`Transaction rolled back`);
                    connection.release();
                    reject(error);
                  });
                }
                else {

                  const sql = "SELECT * FROM USER_GROUP WHERE OWNER_ID=? AND USER_GROUP_DATE=? AND USER_GROUP_TITLE=?";
                  connection.query(sql, [userGroupData.OWNER_ID, userGroupData.USER_GROUP_DATE, userGroupData.USER_GROUP_TITLE], (error, result) => {
                    if (error) {
                      connection.rollback(() => {
                        console.log(`Transaction rolled back`);
                        connection.release();
                        reject(error);
                      });
                    }
                    else {

                      const userGroup = result[0];
          
                      let members = userGroupData.USER_GROUP_MEMBERS;
                      // Owner would be the member of the group by default
                      if (!members.includes(userGroupData.OWNER_ID)) {
                        members = [userGroupData.OWNER_ID, ...members];
                      }

                      const addMemberPromises = members.map((memberId) => {
                        return new Promise((resolve, reject) => {
                          const sql = "INSERT INTO USER_GROUP_MEMBERSHIP (USER_GROUP_ID, MEMBER_ID) VALUES (?,?)";
                          connection.query(sql, [userGroup.USER_GROUP_ID, memberId], (error, result) => {
                            if (error) {
                              reject(error);
                            } else {
                              resolve();
                            }
                          });
                        });
                      });

                      Promise.all(addMemberPromises)
                        .then(() => {
                          connection.commit((error) => {
                            if (error) {
                              connection.rollback(() => {
                                connection.release();
                                reject(error);
                              });
                            } else {
                              console.log(`Transaction committed.`);
                              connection.release();
                              resolve(userGroup);
                            }
                          }); // commit
                        })
                        .catch((error) => {
                          connection.rollback(() => {
                            connection.release();
                            reject(error);
                          });
                        });

                    }
                  });

                }
              }); //INSERT INTO USER_GROUP

            }
          }); // beginTransaction
        } 
      }); // getConnection

    });
  }


  // create(userGroupData) {
  //   return new Promise((resolve, reject) => {
  //     this._validate(userGroupData);
  
  //     connectionPool.getConnection()
  //       .then((connection) => {
  //         console.log('Connection acquired');
  //         return connection.beginTransaction();
  //       })
  //       .then((connection) => {
  //         console.log('Transaction started');
  //         const sql = "INSERT INTO USER_GROUP (OWNER_ID, USER_GROUP_DATE, USER_GROUP_TITLE, USER_GROUP_DESCRIPTION) VALUES (?, ?, ?, ?)";
  //         return connection.query(sql, [userGroupData.OWNER_ID, userGroupData.USER_GROUP_DATE, userGroupData.USER_GROUP_TITLE, userGroupData.USER_GROUP_DESCRIPTION])
  //           .then((result) => {
  //             const sql = "SELECT * FROM USER_GROUP WHERE OWNER_ID=? AND USER_GROUP_DATE=? AND USER_GROUP_TITLE=?";
  //             return connection.query(sql, [userGroupData.OWNER_ID, userGroupData.USER_GROUP_DATE, userGroupData.USER_GROUP_TITLE]);
  //           })
  //           .then((result) => {
  //             const userGroup = result[0];
  //             let members = userGroupData.USER_GROUP_MEMBERS;
  //             if (!members.includes(userGroupData.OWNER_ID)) {
  //               members = [userGroupData.OWNER_ID, ...members];
  //             }
  
  //             const addMemberPromises = members.map((memberId) => {
  //               const sql = "INSERT INTO USER_GROUP_MEMBERSHIP (USER_GROUP_ID, MEMBER_ID) VALUES (?,?)";
  //               return connection.query(sql, [userGroup.USER_GROUP_ID, memberId]);
  //             });
  
  //             return Promise.all(addMemberPromises)
  //               .then(() => {
  //                 connection.commit()
  //                   .then(() => {
  //                     console.log('Transaction committed');
  //                     connection.release();
  //                     resolve(userGroup);    
  //                   })
  //                   .catch((error) => {
  //                     connection.release();
  //                     reject(error);
  //                   });
  //               });
  //           })
  //           .catch((error) => {
  //             console.log('Transaction rolled back');
  //             connection.rollback()
  //               .then(() => {
  //                 connection.release();
  //                 reject(error);
  //               })
  //               .catch((rollbackError) => {
  //                 connection.release();
  //                 reject(rollbackError);
  //               });
  //           });
  //       })
  //       .catch((error) => {
  //         console.error('Error acquiring connection or starting transaction:', error);
  //         reject(error);
  //       });
  //   });
  // }


  update(userId, userGroupId, userGroupData) {
    throw { message: `To be implemented` };
  }

  delete(userId, userGroupId) {
    throw { message: `To be implemented` };
  }

  // OWNER_ID INT NOT NULL,
  // USER_GROUP_DATE DATETIME NOT NULL,
  // USER_GROUP_TITLE VARCHAR(50) NOT NULL UNIQUE,
  // USER_GROUP_DESCRIPTION VARCHAR(100),
  //TODO Also add users as members
  _validate(userGroupData) {
    const schema = Joi.object({
      OWNER_ID: Joi.number().required(),
      USER_GROUP_DATE: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
      USER_GROUP_TITLE: Joi.string().required().min(3).max(50),
      USER_GROUP_DESCRIPTION:Joi.string().required().min(3).max(100),
      USER_GROUP_MEMBERS: Joi.array().items(Joi.number()).min(1).required()
    });

    const validateResult = schema.validate(userGroupData);
    if (validateResult.error) {
      console.log(validateResult.error);
      throw validateResult.error;
    }
  }
}

module.exports = new GroupModel();
