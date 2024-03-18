const transactionModel = require("../models/TransactionModel");

class TransactionController {

  async getAll(req, res) {
    throw { message: `To be implemented` };
  }

  async getById(req, res) {
    throw { message: `To be implemented` };
  }

  async create(req, res) {
    console.log("Transaction create is invoked...");
    try {
      const transactionData = req.body;
      const data = await transactionModel.create(transactionData);

      res.status(201).json(data); // Send the saved object as a JSON response
      console.log(`Transaction is created ${data}`);
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

module.exports = new TransactionController();
