const Joi = require("joi");
const getConnection = require("../database");

class GroupModel {

  /**
   * Get all groups owned by a user.
   *
   * @param {number} ownerId - The user ID.
   * @returns {Promise<Array>} An array of group objects.
   */
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

  /**
   * Get a group by ID.
   *
   * @param {number} ownerId - The user ID.
   * @param {number} groupId - The group ID.
   * @returns {Promise<Object>} The group object.
   * @throws {Error} If the group is not found.
   */
  async getById(ownerId, groupId) {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute("SELECT * FROM USER_GROUP WHERE OWNER_ID=? AND USER_GROUP_ID=?", [ownerId, groupId]);
      if (!rows || rows.length == 0) {
        throw new Error(`No group found for id ${groupId}`);
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

  /**
   * Create a new group.
   *
   * @param {{OWNER_ID: number, USER_GROUP_DATE: string, USER_GROUP_TITLE: string, USER_GROUP_DESCRIPTION: string, USER_GROUP_MEMBERS: Array<number>}} userGroupData - The group data.
   * @returns {Promise<Object>} An object containing the new group's ID.
   * @throws {Error} If the data is not valid.
   */
  async create({OWNER_ID, USER_GROUP_DATE, USER_GROUP_TITLE, USER_GROUP_DESCRIPTION, USER_GROUP_MEMBERS}) {
    const connection = await getConnection();
    try {
      this._validate({OWNER_ID, USER_GROUP_DATE, USER_GROUP_TITLE, USER_GROUP_DESCRIPTION, USER_GROUP_MEMBERS});

      await connection.beginTransaction();
      try {
        const result = await connection.execute("INSERT INTO USER_GROUP (OWNER_ID, USER_GROUP_DATE, USER_GROUP_TITLE, USER_GROUP_DESCRIPTION) VALUES (?, ?, ?, ?)", [OWNER_ID, USER_GROUP_DATE, USER_GROUP_TITLE, USER_GROUP_DESCRIPTION]);
        console.log(`Group inserted with id ${result[0].insertId}`);

        const USER_GROUP_ID = result[0].insertId;

        let memberIds = USER_GROUP_MEMBERS;
        // Owner would be the member of the group by default
        if (!memberIds.includes(OWNER_ID)) {
          memberIds = [OWNER_ID, ...memberIds];
        }

        for (const memberId of memberIds) {
          await connection.execute("INSERT INTO USER_GROUP_MEMBERSHIP (USER_GROUP_ID, MEMBER_ID) VALUES (?,?)", [USER_GROUP_ID, memberId]);
        };

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

  /**
   * Update a group.
   *
   * @param {number} userId - The user ID.
   * @param {number} userGroupId - The group ID.
   * @param {{USER_GROUP_DATE: string, USER_GROUP_TITLE: string, USER_GROUP_DESCRIPTION: string, USER_GROUP_MEMBERS: Array<number>}} userGroupData - The new group data.
   * @returns {Promise<void>}
   * @throws {Error} To be implemented.
   */
  async update(userId, userGroupId, userGroupData) {
    throw new Error(`To be implemented`);
  }

  /**
   * Delete a group.
   *
   * @param {number} userId - The user ID.
   * @param {number} userGroupId - The group ID.
   * @returns {Promise<void>}
   * @throws {Error} To be implemented.
   */
  async delete(userId, userGroupId) {
    throw new Error(`To be implemented`);
  }

  /**
   * Validate group data.
   *
   * @param {{OWNER_ID: number, USER_GROUP_DATE: string, USER_GROUP_TITLE: string, USER_GROUP_DESCRIPTION: string, USER_GROUP_MEMBERS: Array<number>}} userGroupData - The group data.
   * @throws {Error} If the data is not valid.
   * @private
   */
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
