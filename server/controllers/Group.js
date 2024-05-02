const repository = require("../repositories/Group");

/**
 * Class representing a Group Controller.
 */
class Group {
  /**
   * Get all user groups.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  async getAll(req, res) {
    console.log("User Group getAll is invoked...");
    try {
      const data = await repository.getAll();

      res.status(200).json(data); // Send the saved object as a JSON response
      console.log(`User Groups found ${data}`);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Get a user group by ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  async getById(req, res) {
    const { id } = req.params;
    try {
      const data = await repository.getById(parseInt(id));
      console.log(`data=${JSON.stringify(data)}`);

      res.status(200).json(data); // Send the retrieved object as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Create a new user group.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  async create(req, res) {
    console.log("User Group create is invoked...");
    try {
      const userGroupData = req.body;
      const data = await repository.create(userGroupData);

      res.status(201).json(data); // Send the saved object as a JSON response
      console.log(`User Group is created ${data}`);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Update a user group.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  async update(req, res) {
    console.log("Group update is invoked");

    try {
      const{userGroupId} = req.params;
      console.log("id=", userGroupId);

      const { USER_GROUP_DATE, USER_GROUP_TITLE, USER_GROUP_DESCRIPTION, USER_GROUP_MEMBERS} = req.body;
      console.log(`USER_GROUP_DATE=${USER_GROUP_DATE} USER_GROUP_TITLE=${USER_GROUP_TITLE} USER_GROUP_DESCRIPTION=${USER_GROUP_DESCRIPTION}`);
      console.log(`USER_GROUP_MEMBERS=${USER_GROUP_MEMBERS}`);

      const data = await repository.update(parseInt(userGroupId), {USER_GROUP_DATE, USER_GROUP_TITLE, USER_GROUP_DESCRIPTION, USER_GROUP_MEMBERS});

      res.status(201).json(data);
    }catch (error) {
      console.error(error.message);
      res.status(500).json({message: error.message});
    }
  }

  /**
   * Delete a user group.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  async delete(req, res) {
    console.log("Group delete is invoked...");
    try {
      const { userGroupId } = req.params;
      console.log("id=", userGroupId);
      console.log("params=", req.params);
      console.log("Requested URL:", req.originalUrl);

      const data = await repository.delete(parseInt(userGroupId));

      res.status(201).json(data); // Send the saved object as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Delete a member from a user group.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  async deleteMember(req, res) {
    console.log("Group delete is invoked...");
    try {
      const { userGroupId } = req.params;
      const { memberId } = req.params;
      console.log("userGroupId=", userGroupId);
      console.log("memberId=", memberId);
      console.log("params=", req.params);
      console.log("Requested URL:", req.originalUrl);

      const data = await repository.deleteMember(parseInt(userGroupId), parseInt(memberId));

      res.status(201).json(data); // Send the saved object as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Get members of a user group.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  async getMembers(req, res) {
    const { id } = req.params;
    try {
      const data = await repository.getMembers(parseInt(id));
      console.log(`data=${JSON.stringify(data)}`);

      res.status(200).json(data); // Send the retrieved object as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Get active members of a user group.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  async getActiveMembers(req, res) {
    const { id } = req.params;
    try {
      const data = await repository.getActiveMembers(parseInt(id));
      console.log(`data=${JSON.stringify(data)}`);

      res.status(200).json(data); // Send the retrieved object as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Get transactions of a user group.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  async getTransactions(req, res) {
    const { id } = req.params;
    try {
      const data = await repository.getTransactions(parseInt(id));
      console.log(`data=${JSON.stringify(data)}`);

      res.status(200).json(data); // Send the retrieved object as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Get settlement summary of a user group.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  async getSettlementSummary(req, res) {
    const { id } = req.params;
    try {
      const data = await repository.getSettlementSummary(parseInt(id));
      console.log(`data=${JSON.stringify(data)}`);

      res.status(200).json(data); // Send the retrieved object as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new Group();
