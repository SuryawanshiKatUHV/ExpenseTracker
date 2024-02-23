const budgetModel = require("../models/BudgetModel");

class BudgetController {

  async getAll(req, res) {
    try {
      res.json(budgetModel.getAll()); // Send the categories as a JSON response
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    const { id } = req.params;
    try {
      res.status(201).json(budgetModel.getById(parseInt(id))); // Send the retrieved object as a JSON response
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async create(req, res) {
    const { key1, key2 } = req.body;
    try {
      res.status(201).json(budgetModel.create({key1, key2})); // Send the saved object as a JSON response
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { key1, key2 } = req.body;
    try {
      res.status(201).json(budgetModel.update(parseInt(id), { key1, key2 })); // Send the saved object as a JSON response
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async delete(req, res) {
    const { id } = req.params;
    try {
      res.status(201).json(budgetModel.delete(parseInt(id))); // Send the deleted object as a JSON response
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  
}

module.exports = new BudgetController();
