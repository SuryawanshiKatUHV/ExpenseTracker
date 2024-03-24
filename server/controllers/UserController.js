const userModel = require("../models/UserModel");

/**
 * UserController class responsible for handling user-related operations.
 */
class UserController {

   /**
   * Retrieve all users.
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   */
  async getAll(req, res) {
    console.log("User getAll is invoked...");
    try {
      const data = await userModel.getAll();

      res.status(200).json(data); // Send the users as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

   /**
   * Retrieve a user by ID.
   *
   * @param {Object} req - Express request object. req.params contains the id of the object.
   * @param {Object} res - Express response object.
   * @returns {void}
   */
  async getById(req, res) {
    console.log("User getById is invoked...");
    try {
      const { id } = req.params;
      console.log("id=", id);

      const data = await userModel.getById(parseInt(id));

      res.status(200).json(data); // Send the retrieved object as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

   /**
   * Create a new user.
   *
   * @param {Object} req - Express request object. req.body contains the user data object.
   * @param {Object} res - Express response object.
   * @returns {void}
   */
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

  /**
   * Log in a user. req.body contains the user credential object.
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {void}
   */
  async login(req, res) {
    console.log("User login is invoked...");
    try {
      const { USER_EMAIL, USER_PASSWORD } = req.body;
      const data = await userModel.login({USER_EMAIL, USER_PASSWORD});

      res.status(200).json(data); // Send the saved object as a JSON response
      console.log(`User is logged in ${data}`);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Update a user.
   *
   * @param {Object} req - Express request object. req.params contains the id of the object.
   * @param {Object} res - Express response object.
   * @returns {void}
   */
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

  /**
   * Delete a user.
   *
   * @param {Object} req - Express request object. req.params contains the id of the object.
   * @param {Object} res - Express response object.
   * @returns {void}
   */
  async delete(req, res) {
    console.log("User delete is invoked...");
    try {
      const { id } = req.params;
      console.log("id=", id);

      const user = req.user;

      if (user.USER_ID == parseInt(id)) {
        throw new Error(`User cannot delete self account.`);
      }
      else {
        const data = await userModel.delete(parseInt(id));
        res.status(200).json(data); // Send the saved object as a JSON response
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  async getCategories(req, res) {
    console.log("User getCategories is invoked...");
    try {
      const { id } = req.params;
      console.log("id=", id);
      const data = await userModel.getCategories(parseInt(id));

      res.status(200).json(data); // Send the users as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }
  
  async getTransactions(req, res) {
    console.log("User getTransactions is invoked...");
    try {
      const { id } = req.params;
      console.log("id=", id);
      const data = await userModel.getTransactions(parseInt(id));

      res.status(200).json(data); // Send the users as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  async getGroups(req, res) {
    console.log("User getGroups is invoked...");
    try {
      const { id } = req.params;
      console.log("id=", id);
      const data = await userModel.getGroups(parseInt(id));

      res.status(200).json(data); // Send the users as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  async getGroupTransactionsPaid(req, res) {
    console.log("User getGroupTransactionsPaid is invoked...");
    try {
      const { userId, groupId } = req.params;
      console.log(`userId=${userId} groupId=${groupId}`);
      const data = await userModel.getGroupTransactionsPaid(parseInt(userId), parseInt(groupId));

      res.status(200).json(data); // Send the users as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  async getGroupTransactionsReceived(req, res) {
    console.log("User getGroupTransactionsReceived is invoked...");
    try {
      const { userId, groupId } = req.params;
      console.log(`userId=${userId} groupId=${groupId}`);
      const data = await userModel.getGroupTransactionsReceived(parseInt(userId), parseInt(groupId));

      res.status(200).json(data); // Send the users as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

}

module.exports = new UserController();
