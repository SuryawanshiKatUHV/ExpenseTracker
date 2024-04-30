const Joi = require("joi");
const {getConnection} = require('../common/database');

class Group {

  async getAll() {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute("SELECT *, DATE_FORMAT(USER_GROUP_DATE, '%Y-%m-%d') AS USER_GROUP_DATE FROM USER_GROUP", []);
      return rows;
    }
    finally {
      connection.release();
    }
  }

  async getById(groupId) {
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute(`SELECT * FROM USER_GROUP WHERE USER_GROUP_ID=?`, [groupId]);
      if (!rows || rows.length == 0) {
        throw new Error(`No group found for id ${groupId}`);
      }

      const group = rows[0];
      const [rows2, fields2] = await connection.execute(`SELECT USER_ID, USER_FNAME, USER_LNAME, USER_EMAIL FROM USER_GROUP_MEMBERSHIP JOIN USER ON USER.USER_ID = USER_GROUP_MEMBERSHIP.MEMBER_ID WHERE USER_GROUP_ID=?`, [groupId]);
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
  async update(userGroupId, {USER_GROUP_DATE, USER_GROUP_TITLE, USER_GROUP_DESCRIPTION, USER_GROUP_MEMBERS}) {
    // console.log("inside group repo");
    // console.log(`USER_GROUP_DATE=${USER_GROUP_DATE} USER_GROUP_TITLE=${USER_GROUP_TITLE} USER_GROUP_DESCRIPTION=${USER_GROUP_DESCRIPTION}`);
    // console.log(`USER_GROUP_MEMBERS=${USER_GROUP_MEMBERS}`); //ids 

    const connection = await getConnection();
    try {

      await connection.beginTransaction();
      try {
        const result = await connection.execute("UPDATE USER_GROUP SET USER_GROUP_DATE=?, USER_GROUP_TITLE=?, USER_GROUP_DESCRIPTION=? WHERE USER_GROUP_ID=?", [USER_GROUP_DATE, USER_GROUP_TITLE, USER_GROUP_DESCRIPTION, userGroupId]);
        
        if (result.affectedRows === 0) {
          throw new Error(`No group found for id ${userGroupId}`);
        }
        console.log(`Group updated with id ${userGroupId}`);
  
        const [existingMembers] = await connection.execute("SELECT MEMBER_ID FROM USER_GROUP_MEMBERSHIP WHERE USER_GROUP_ID=?", [userGroupId]);
        // Store results of existing member ids into array
        const existingMemberIds = existingMembers.map(member => member.MEMBER_ID);
        const membersToRemove = existingMemberIds.filter(memberId => !USER_GROUP_MEMBERS.includes(memberId));
        const membersToAdd = USER_GROUP_MEMBERS.filter(memberId => !existingMemberIds.includes(memberId));

        // Remove members
        for (const memberId of membersToRemove) {
            await connection.execute("DELETE FROM USER_GROUP_MEMBERSHIP WHERE USER_GROUP_ID=? AND MEMBER_ID=?", [userGroupId, memberId]);
        }

        // Add new members
        for (const memberId of membersToAdd) {
            await connection.execute("INSERT INTO USER_GROUP_MEMBERSHIP (USER_GROUP_ID, MEMBER_ID) VALUES (?,?)", [userGroupId, memberId]);
        }
  
        await connection.commit();
        return {userGroupId};
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
   * Delete a group.
   *
   * 
   * @param {number} userGroupId - The group ID.
   * @returns {Promise<void>}
   * @throws {Error} To be implemented.
   */
  async delete(userGroupId) {
    const connection = await getConnection();
    try {
      const result = await connection.execute("DELETE FROM USER_GROUP WHERE USER_GROUP_ID=? ", [userGroupId]);
  
      if (result.affectedRows === 0) {
        throw new Error(`No group found with USER_GROUP_ID=${userGroupId}`);
      }
  
      return result;
    } finally {
      connection.release();
    }
  }

  async getMembers(groupId) {
    const SQL =
    `SELECT UGM.USER_GROUP_ID, UGM.MEMBER_ID, CONCAT(U.USER_LNAME, ", ", U.USER_FNAME) AS USER_FULLNAME
    FROM USER_GROUP_MEMBERSHIP UGM
    JOIN USER U ON U.USER_ID = UGM.MEMBER_ID
    JOIN USER_GROUP UG ON UG.USER_GROUP_ID = UGM.USER_GROUP_ID
    WHERE UG.USER_GROUP_ID=?
    ORDER BY USER_FULLNAME ASC`;
  
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute(SQL, [groupId]);
      return rows;
    }
    finally {
      connection.release();
    }
  }

  async getActiveMembers(groupId) {
    const SQL = `SELECT UGT.PAID_BY_USER_ID, UGT.PAID_TO_USER_ID
    FROM USER_GROUP_TRANSACTION UGT
    WHERE UGT.USER_GROUP_ID=?;`
    
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute(SQL, [groupId]);
      return rows;
    }
    finally {
      connection.release();
    }
  }

  async getTransactions(groupId) {
    const SQL = 
    `SELECT 
      T.TRANSACTION_ID,
      DATE_FORMAT(T.TRANSACTION_DATE, '%m/%d/%Y') AS TRANSACTION_DATE,
      T.TRANSACTION_AMOUNT,
      T.TRANSACTION_NOTES,
      UGT.PAID_BY_USER_ID,
      CONCAT(U1.USER_LNAME, ", ", U1.USER_FNAME) AS PAID_BY_USER_FULLNAME,
      GROUP_CONCAT(DISTINCT CONCAT(U2.USER_LNAME, ", ", U2.USER_FNAME) SEPARATOR '; ') AS PAID_TO_USER_FULLNAME
    FROM USER_GROUP_TRANSACTION UGT
    JOIN USER U1 ON U1.USER_ID = UGT.PAID_BY_USER_ID
    JOIN USER U2 ON U2.USER_ID = UGT.PAID_TO_USER_ID
    JOIN TRANSACTION T ON T.TRANSACTION_ID = UGT.TRANSACTION_ID
    WHERE UGT.USER_GROUP_ID=?
    GROUP BY
      T.TRANSACTION_ID, T.TRANSACTION_DATE, T.TRANSACTION_AMOUNT, T.TRANSACTION_NOTES, UGT.PAID_BY_USER_ID, CONCAT(U1.USER_LNAME, ", ", U1.USER_FNAME)
    ORDER BY T.TRANSACTION_DATE DESC`;

    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute(SQL, [groupId]);
      return rows;
    }
    finally {
      connection.release();
    }
  }

  async getSettlementSummary(groupId) {
    const SQL =
    `SELECT
      u.USER_ID,
      CONCAT(u.USER_LNAME, ", ", u.USER_FNAME) AS USER_FULLNAME,
      COALESCE(SUM(p.amount_paid), 0) AS TOTAL_AMOUNT_PAID,
      COALESCE(SUM(r.amount_received), 0) AS TOTAL_AMOUNT_RECEIVED,
      (COALESCE(SUM(p.amount_paid), 0) - COALESCE(SUM(r.amount_received), 0)) AS UNSETTLED_DUE
    FROM
        USER u
    LEFT JOIN
        (SELECT
            USER_GROUP_ID,
            PAID_BY_USER_ID AS USER_ID,
            SUM(USER_GROUP_TRANSACTION_AMOUNT) AS amount_paid
        FROM
            USER_GROUP_TRANSACTION
      GROUP BY
        USER_GROUP_ID, PAID_BY_USER_ID) p
    ON
        u.USER_ID = p.USER_ID AND p.USER_GROUP_ID = ?
    LEFT JOIN
        (SELECT
            USER_GROUP_ID,
            PAID_TO_USER_ID AS USER_ID,
            SUM(USER_GROUP_TRANSACTION_AMOUNT) AS amount_received
        FROM
            USER_GROUP_TRANSACTION
      GROUP BY
        USER_GROUP_ID, PAID_TO_USER_ID) r
    ON
        u.USER_ID = r.USER_ID AND r.USER_GROUP_ID = ?
    WHERE
    u.USER_ID IN (
      SELECT MEMBER_ID AS USER_ID
            FROM USER_GROUP_MEMBERSHIP
            WHERE USER_GROUP_ID = ?
        )
    GROUP BY
        u.USER_ID`;
      
    const connection = await getConnection();
    try {
      const [rows, fields] = await connection.execute(SQL, [groupId, groupId, groupId]);
      return rows;
    }
    finally {
      connection.release();
    }
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

module.exports = new Group();
