const categoryModel = require("../models/CategoryModel");


class CategoryController {

  async getAll(req, res) {
    console.log("Category getAll is invoked...");
    try {
      const user = req.user;

      console.log(`Received req.user=${JSON.stringify(req.user)}`);
      const data = await categoryModel.getAll(user.USER_ID); // Correctly await the promise

      res.status(200).json(data); // Use 200 status code and ensure to send the awaited data
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message }); // Error handling remains the same
    }
  }

  async getById(req, res) {
    const user = req.user;
    const { id } = req.params;
    try {
      const data = await categoryModel.getById(user.USER_ID, parseInt(id));
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

      const data = await categoryModel.create(categoryData);

      res.status(201).json(data); // Send the saved object as a JSON response
      console.log(`Category is created ${JSON.stringify(data)}`);
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

module.exports = new CategoryController();
