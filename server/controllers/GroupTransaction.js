const repository = require("../repositories/GroupTransaction");

/**
 * Class representing a Group Transaction Controller.
 */
class GroupTransaction {
  /**
   * Get all group transactions.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  async getAll(req, res) {
    console.log("Group Transaction getAll is invoked...");
    try {
      const data = await repository.getAll();

      res.status(200).json(data); // Send the saved object as a JSON response
      console.log(`Group Transactions found ${JSON.stringify(data)}`);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Get a group transaction by ID.
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
   * Create a new group transaction.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<Object>} A Promise that resolves to the newly created group transaction object if successful.
   */
  async create(req, res) {
    console.log("Group Transaction create is invoked...");
    try {
      const user = req.user;
      console.log(`user=${user}`);
      const transactionData = req.body;
      transactionData.PAID_BY_USER_ID = user.USER_ID;

      console.log(`transactionData=${transactionData}`);
      const data = await repository.create(transactionData);

      res.status(201).json(data); // Send the saved object as a JSON response
      console.log(`Group Transaction is created ${JSON.stringify(data)}`);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new GroupTransaction();
