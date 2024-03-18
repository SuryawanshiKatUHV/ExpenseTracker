const groupModel = require("../models/GroupModel");

class GroupController {

  async getAll(req, res) {
    console.log("User Group getAll is invoked...");
    try {
      const user = req.user;
      const data = await groupModel.getAll(user.USER_ID);

      res.status(201).json(data); // Send the saved object as a JSON response
      console.log(`User Groups found ${data}`);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    throw { message: `To be implemented` };
  }

  async create(req, res) {
    console.log("User Group create is invoked...");
    try {
      const userGroupData = req.body;
      const data = await groupModel.create(userGroupData);

      res.status(201).json(data); // Send the saved object as a JSON response
      console.log(`User Group is created ${data}`);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    throw { message: `To be implemented` };
  }

  async delete(req, res) {
    throw { message: `To be implemented` };
  }
  
}

module.exports = new GroupController();
