const repository = require("../repositories/Budget");

class Budget {

  async getAll(req, res) {
    console.log("budget getAll in controller is invoked...");
    try {
      const data = await repository.getAll();

      res.status(200).json(data); // Send the budgets as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    const { id } = req.params;
    console.log("budget getID in controller is invoked...");
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
    console.log("Budget create is invoked...");
    try {
      const BudgetData = req.body;
      console.log(`BudgetData=${JSON.stringify(BudgetData)}`);

      const data = await repository.create(BudgetData);

      res.status(201).json(data); // Send the saved object as a JSON response
      console.log(`Budget is created ${JSON.stringify(data)}`);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    console.log("Budget update is invoked");
    try {
      const{ id } = req.params;
      console.log("id=", id);

      const { BUDGET_DATE, BUDGET_AMOUNT, BUDGET_NOTES } = req.body;
      console.log(`BUDGET_DATE=${BUDGET_DATE} BUDGET_AMOUNT=${BUDGET_AMOUNT} BUDGET_NOTES=${BUDGET_NOTES}`);

      const data = await repository.update(parseInt(id), { BUDGET_DATE, BUDGET_AMOUNT, BUDGET_NOTES });

      res.status(201).json(data);
    }catch (error) {
      console.error(error.message);
      res.status(500).json({message: error.message});
    }
  }

  async delete(req, res) {
    console.log("Budget delete is invoked...");
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

module.exports = new Budget();