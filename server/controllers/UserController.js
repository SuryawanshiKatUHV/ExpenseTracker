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
    const { fname, lname } = req.body;
    try {
      res.status(201).json(userModel.create({fname, lname})); // Send the saved object as a JSON response
    } catch (error) {
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
