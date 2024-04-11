const repository = require("../repositories/Category");

class Category {

  async getAll(req, res) {
    console.log("Category getAll is invoked...");
    try {
      const data = await repository.getAll(); // Correctly await the promise

      res.status(200).json(data); // Use 200 status code and ensure to send the awaited data
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message }); // Error handling remains the same
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
    console.log("Category create is invoked...");
    try {
      const categoryData = req.body;
      console.log(`categoryData=${JSON.stringify(categoryData)}`);

      const data = await repository.create(categoryData);

      res.status(201).json(data); // Send the saved object as a JSON response
      console.log(`Category is created ${JSON.stringify(data)}`);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    console.log("Category update is invoked");

    try {
      const{id} = req.params;
      console.log("id=", id);

      const { CATEGORY_TITLE, CATEGORY_DESCRIPTION } = req.body;
      console.log(`CATEGORY_TITLE=${CATEGORY_TITLE} CATEGORY_DESCRIPTION=${CATEGORY_DESCRIPTION}`);

      const data = await repository.update(parseInt(id), {CATEGORY_TITLE, CATEGORY_DESCRIPTION});

      res.status(201).json(data);
    }catch (error) {
      console.error(error.message);
      res.status(500).json({message: error.message});
    }
  }

  async delete(req, res) {
    console.log("Category delete is invoked...");
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
  
  async getTransactions(req, res) {
    const { id } = req.params;
    try {
      const data = await repository.getTransactions(parseInt(id));
      console.log(`data=${JSON.stringify(data)}`);

      res.status(200).json(data); // Send the retrieved object as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  async getBudgets(req, res) {
    const { id } = req.params;
    try {
      const data = await repository.getBudgets(parseInt(id));
      console.log(`data=${JSON.stringify(data)}`);

      res.status(200).json(data); // Send the retrieved object as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

}

module.exports = new Category();
