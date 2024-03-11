const userModel = require("../models/UserModel");

class UserController {

  async getAll(req, res) {
    console.log("User getAll is invoked...");
    try {
      const data = await userModel.getAll();

      res.status(201).json(data); // Send the users as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    console.log("User getById is invoked...");
    try {
      const { id } = req.params;
      console.log("id=", id);

      const data = await userModel.getById(parseInt(id));

      res.status(201).json(data); // Send the retrieved object as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  async create(req, res) {
    console.log("User create is invoked...");
    try {
      const userData = req.body;
      const data = await userModel.create(userData);

      res.status(201).json(data); // Send the saved object as a JSON response
      console.log(`User is created ${data}`);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  async login(req, res) {
    console.log("User login is invoked...");
    try {
      const { USER_EMAIL, USER_PASSWORD } = req.body;
      const data = await userModel.login({USER_EMAIL, USER_PASSWORD});

      res.status(201).json(data); // Send the saved object as a JSON response
      console.log(`User is logged in ${data}`);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    console.log("User update is invoked...");
    try {
      const { id } = req.params;
      console.log("id=", id);

      const { USER_FNAME, USER_LNAME } = req.body;
      console.log(`USER_FNAME=${USER_FNAME} USER_LNAME=${USER_LNAME}`);

      const data = await userModel.update(parseInt(id), {USER_FNAME, USER_LNAME});

      res.status(201).json(data); // Send the saved object as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  async delete(req, res) {
    console.log("User delete is invoked...");
    try {
      const { id } = req.params;
      console.log("id=", id);

      const data = await userModel.delete(parseInt(id));

      res.status(201).json(data); // Send the saved object as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }
  
}

module.exports = new UserController();
