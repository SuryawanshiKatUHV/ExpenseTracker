const Joi = require("joi");
const getConnection = require("../database");

class GroupModel {

  async getAll(ownerId) {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute("SELECT * FROM USER_GROUP WHERE USER_GROUP_ID IN (SELECT USER_GROUP_ID FROM USER_GROUP_MEMBERSHIP WHERE MEMBER_ID=?)", [ownerId]);
      return rows;
    }
    finally {
      connection.release();
    }
  }

  // CREATE TABLE USER_GROUP (
  //   USER_GROUP_ID INT PRIMARY KEY AUTO_INCREMENT,
  //   OWNER_ID INT NOT NULL,
  //   USER_GROUP_DATE DATETIME NOT NULL,
  //   USER_GROUP_TITLE VARCHAR(50) NOT NULL UNIQUE,
  //   USER_GROUP_DESCRIPTION VARCHAR(100),

  async getById(ownerId, groupId) {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute("SELECT * FROM USER_GROUP WHERE OWNER_ID=? AND USER_GROUP_ID=?", [ownerId, groupId]);
      if (!rows || rows.length == 0) {
        throw new Error(`No category found for id ${groupId}`);
      }

      const group = rows[0];
      const [rows2, fields2] = await connection.execute("SELECT USER_ID, USER_FNAME, USER_LNAME, USER_EMAIL FROM USER_GROUP_MEMBERSHIP JOIN USER ON USER.USER_ID = USER_GROUP_MEMBERSHIP.MEMBER_ID WHERE USER_GROUP_ID=?;", [groupId]);
      group.USER_GROUP_MEMBERS = rows2;

      return group;
    }
    finally {
      connection.release();
    }
  }

  // OWNER_ID INT NOT NULL,
  // USER_GROUP_DATE DATETIME NOT NULL,
  // USER_GROUP_TITLE VARCHAR(50) NOT NULL UNIQUE,
  // USER_GROUP_DESCRIPTION VARCHAR(100),
  // USER_GROUP_MEMBERS=[1,2,3]
  async create({OWNER_ID, USER_GROUP_DATE, USER_GROUP_TITLE, USER_GROUP_DESCRIPTION, USER_GROUP_MEMBERS}) {
    const connection = await getConnection();
    try {
      this._validate({OWNER_ID, USER_GROUP_DATE, USER_GROUP_TITLE, USER_GROUP_DESCRIPTION, USER_GROUP_MEMBERS});

      await connection.beginTransaction();
      try {
        const result = await connection.execute("INSERT INTO USER_GROUP (OWNER_ID, USER_GROUP_DATE, USER_GROUP_TITLE, USER_GROUP_DESCRIPTION) VALUES (?, ?, ?, ?)", [OWNER_ID, USER_GROUP_DATE, USER_GROUP_TITLE, USER_GROUP_DESCRIPTION]);
        console.log(`Group inserted with id ${result[0].insertId}`);

        const USER_GROUP_ID = result[0].insertId;

        let members = USER_GROUP_MEMBERS;
        // Owner would be the member of the group by default
        if (!members.includes(OWNER_ID)) {
          members = [OWNER_ID, ...members];
        }

        members.forEach(async (memberId) => {
          await connection.execute("INSERT INTO USER_GROUP_MEMBERSHIP (USER_GROUP_ID, MEMBER_ID) VALUES (?,?)", [USER_GROUP_ID, memberId]);
        });

        await connection.commit();

        return {USER_GROUP_ID};
      }
      catch(error) {
        await connection.rollback();
        throw error;
      }
    }
    finally {
      connection.release();
    }
  }

  async update(userId, userGroupId, userGroupData) {
    throw new Error(`To be implemented`);
  }

  async delete(userId, userGroupId) {
    throw new Error(`To be implemented`);
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
