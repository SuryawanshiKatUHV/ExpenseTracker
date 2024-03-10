const userModel = require("../models/UserModel");

class UserController {

  async getAll(req, res) {
    try {
      res.json(userModel.getAll()); // Send the categories as a JSON response
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    const { id } = req.params;
    try {
      res.status(201).json(userModel.getById(parseInt(id))); // Send the retrieved object as a JSON response
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async create(req, res) {
    console.log("User create is invoked...");
    try {
      const { email, firstName, lastName, password } = req.body;
      const data = userModel.create({email, firstName, lastName, password});

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
      const { email, password } = req.body;
      const data = userModel.login({email, password});

      res.status(201).json(data); // Send the saved object as a JSON response
      console.log(`User is created ${data}`);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { fname, lname } = req.body;
    try {
      res.status(201).json(userModel.update(parseInt(id), { fname, lname })); // Send the saved object as a JSON response
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async delete(req, res) {
    const { id } = req.params;
    try {
      res.status(201).json(userModel.delete(parseInt(id))); // Send the deleted object as a JSON response
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  
}

module.exports = new UserController();
