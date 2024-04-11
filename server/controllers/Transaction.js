const repository = require("../repositories/Transaction");

class Transaction {

  async getAll(req, res) {
    console.log("Transaction getAll is invoked...");
    try {
      const data = await repository.getAll();

      res.status(200).json(data); // Send the saved object as a JSON response
      console.log(`Transactions found ${JSON.stringify(data)}`);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    throw new Error(`To be implemented`);
  }

  async create(req, res) {
    console.log("Transaction create is invoked...");
    try {
      const transactionData = req.body;
      const data = await repository.create(transactionData);

      res.status(201).json(data); // Send the saved object as a JSON response
      console.log(`Transaction is created ${data}`);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    throw new Error(`To be implemented`);
  }

  async delete(req, res) {
    throw new Error(`To be implemented`);
  }
  
}

module.exports = new Transaction();
