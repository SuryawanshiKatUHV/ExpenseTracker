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
    console.log("Transaction update is invoked");

    try {
      const{id} = req.params;
      console.log("id=", id);

      const { TRANSACTION_TYPE, TRANSACTION_DATE, TRANSACTION_AMOUNT, TRANSACTION_NOTES} = req.body;
      console.log(`TRANSACTION_TYPE=${TRANSACTION_TYPE} TRANSACTION_DATE=${TRANSACTION_DATE} TRANSACTION_AMOUNT=${TRANSACTION_AMOUNT} TRANSACTION_NOTES=${TRANSACTION_NOTES}`);

      const data = await repository.update(parseInt(id), {TRANSACTION_TYPE, TRANSACTION_DATE, TRANSACTION_AMOUNT, TRANSACTION_NOTES});

      res.status(201).json(data);
    }catch (error) {
      console.error(error.message);
      res.status(500).json({message: error.message});
    }
  }

  async delete(req, res) {
    console.log("Transaction delete is invoked...");
    try {
      const { id } = req.params;
      console.log("id=", id);

      const data = await repository.delete(parseInt(id));

      res.status(201).json(data); // Send the saved object as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }
  
}

module.exports = new Transaction();
