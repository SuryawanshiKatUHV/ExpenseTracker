const repository = require("../repositories/User");

/**
 * User class responsible for handling user-related operations.
 */
class User {
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
      const data = await repository.getAll();

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

      const data = await repository.getById(parseInt(id));

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
      const data = await repository.create(userData);

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
      const data = await repository.login({USER_EMAIL, USER_PASSWORD});

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

      const data = await repository.update(parseInt(id), {USER_FNAME, USER_LNAME});

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
        const data = await repository.delete(parseInt(id));
        res.status(200).json(data); // Send the saved object as a JSON response
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Retrieve categories associated with a user.
   *
   * @param {Object} req - Express request object. req.params contains the id of the user.
   * @param {Object} res - Express response object.
   * @returns {void}
   */
  async getCategories(req, res) {
    console.log("User getCategories is invoked...");
    try {
      const { id } = req.params;
      console.log("id=", id);
      const data = await repository.getCategories(parseInt(id));

      res.status(200).json(data); // Send the users as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Retrieve budgets associated with a user.
   *
   * @param {Object} req - Express request object. req.params contains the id of the user.
   * @param {Object} res - Express response object.
   * @returns {void}
   */
  async getBudgets(req, res) {
    console.log("User getBudgets is invoked...");
    try {
      const { id } = req.params;
      console.log("id=", id);
      const data = await repository.getBudgets(parseInt(id));

      res.status(200).json(data); // Send the users as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Retrieve budgets associated with a user for a specific month.
   *
   * @param {Object} req - Express request object. req.params contains the id, year, and month.
   * @param {Object} res - Express response object.
   * @returns {void}
   */
  async getBudgetsByMonth(req, res) {
    console.log("User getBudgetsByMonth is invoked...");
    try {
      const { id, year, month } = req.params;
      console.log(`id=${id} year=${year} month=${month}`);

      const data = await repository.getBudgetsByMonth(parseInt(id), parseInt(year), parseInt(month));

      res.status(200).json(data); // Send the users as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Retrieve transactions associated with a user.
   *
   * @param {Object} req - Express request object. req.params contains the id of the user.
   * @param {Object} res - Express response object.
   * @returns {void}
   */
  async getTransactions(req, res) {
    console.log("User getTransactions is invoked...");
    try {
      const { id } = req.params;
      console.log("id=", id);
      const data = await repository.getTransactions(parseInt(id));

      res.status(200).json(data); // Send the users as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Retrieve transactions associated with a user for a specific month.
   *
   * @param {Object} req - Express request object. req.params contains the id, year, and month.
   * @param {Object} res - Express response object.
   * @returns {void}
   */
  async getTransactionsByMonth(req, res) {
    console.log("User getTransactionsByMonth is invoked...");
    try {
      const { id, year, month } = req.params;
      console.log(`id=${id} year=${year} month=${month}`);

      const data = await repository.getTransactionsByMonth(parseInt(id), parseInt(year), parseInt(month));

      res.status(200).json(data); // Send the users as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Retrieve groups associated with a user.
   *
   * @param {Object} req - Express request object. req.params contains the id of the user.
   * @param {Object} res - Express response object.
   * @returns {void}
   */
  async getGroups(req, res) {
    console.log("User getGroups is invoked...");
    try {
      const { id } = req.params;
      console.log("id=", id);
      const data = await repository.getGroups(parseInt(id));

      res.status(200).json(data); // Send the users as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Retrieve group transactions paid by a user.
   *
   * @param {Object} req - Express request object. req.params contains the userId and groupId.
   * @param {Object} res - Express response object.
   * @returns {void}
   */
  async getGroupTransactionsPaid(req, res) {
    console.log("User getGroupTransactionsPaid is invoked...");
    try {
      const { userId, groupId } = req.params;
      console.log(`userId=${userId} groupId=${groupId}`);
      const data = await repository.getGroupTransactionsPaid(parseInt(userId), parseInt(groupId));

      res.status(200).json(data); // Send the users as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Retrieve group transactions received by a user.
   *
   * @param {Object} req - Express request object. req.params contains the userId and groupId.
   * @param {Object} res - Express response object.
   * @returns {void}
   */
  async getGroupTransactionsReceived(req, res) {
    console.log("User getGroupTransactionsReceived is invoked...");
    try {
      const { userId, groupId } = req.params;
      console.log(`userId=${userId} groupId=${groupId}`);
      const data = await repository.getGroupTransactionsReceived(parseInt(userId), parseInt(groupId));

      res.status(200).json(data); // Send the users as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Retrieve group transactions where the user is owed money.
   *
   * @param {Object} req - Express request object. req.params contains the id of the user.
   * @param {Object} res - Express response object.
   * @returns {void}
   */
  async getGroupTransactionsMoneyOwedToMe(req, res) {
    console.log("User getGroupTransactionsMoneyOwedToMe is invoked...");
    try {
      const { id } = req.params;
      console.log("id=", id);
      const data = await repository.getGroupTransactionsMoneyOwedToMe(parseInt(id));

      res.status(200).json(data); // Send the users as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Retrieve group transactions where the user needs to pay money.
   *
   * @param {Object} req - Express request object. req.params contains the id of the user.
   * @param {Object} res - Express response object.
   * @returns {void}
   */
  async getGroupTransactionsMoneyINeedToPay(req, res) {
    console.log("User getGroupTransactionsMoneyINeedToPay is invoked...");
    try {
      const { id } = req.params;
      console.log("id=", id);
      const data = await repository.getGroupTransactionsMoneyINeedToPay(parseInt(id));

      res.status(200).json(data); // Send the users as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Retrieve the year-month range of transactions associated with a user.
   *
   * @param {Object} req - Express request object. req.params contains the id of the user.
   * @param {Object} res - Express response object.
   * @returns {void}
   */
  async getTransactionsYearMonthRange(req, res) {
    console.log("getTransactionsYearMonthRange is invoked...");
    try {
      const { id } = req.params;
      console.log("id=", id);
      const data = await repository.getTransactionsYearMonthRange(parseInt(id));

      res.status(200).json(data); // Send the saved object as a JSON response
      console.log(`Transactions year month range found ${JSON.stringify(data)}`);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Retrieve the year-month range of budgets associated with a user.
   *
   * @param {Object} req - Express request object. req.params contains the id of the user.
   * @param {Object} res - Express response object.
   * @returns {void}
   */
  async getBudgetsYearMonthRange(req, res) {
    console.log("getBudgetsYearMonthRange is invoked...");
    try {
      const { id } = req.params;
      console.log("id=", id);
      const data = await repository.getBudgetsYearMonthRange(parseInt(id));

      res.status(200).json(data); // Send the saved object as a JSON response
      console.log(`Budgets year month range found ${JSON.stringify(data)}`);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Retrieve the summary of transactions associated with a user for a specific type and month.
   *
   * @param {Object} req - Express request object. req.params contains the id, type, year, and month.
   * @param {Object} res - Express response object.
   * @returns {void}
   */
  async getTransactionsSummary(req, res) {
    console.log("getTransactionsSummary is invoked...");
    try {
      const { id, type, year, month } = req.params;
      console.log(`id=${id} type=${type} year=${year} month=${month}`);

      const data = await repository.getTransactionsSummary(parseInt(id), type, parseInt(year), parseInt(month));

      res.status(200).json(data); // Send the saved object as a JSON response
      console.log(`getTransactionsSummary found ${JSON.stringify(data)}`);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new User();
