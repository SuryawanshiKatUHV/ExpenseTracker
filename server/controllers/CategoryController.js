const CategoryModel = require("../models/CategoryModel");
const categoryModel = require("../models/CategoryModel");


class CategoryController {

  async getAll(req, res) {
    console.log("Category getAll is invoked...");
    try {
      const data = await categoryModel.getAll(); // Correctly await the promise

      res.status(200).json(data); // Use 200 status code and ensure to send the awaited data
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message }); // Error handling remains the same
    }
}


  async getById(req, res) {
    const { id } = req.params;
    try {
      res.status(201).json(catgeoryModel.getById(parseInt(id))); // Send the retrieved object as a JSON response
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async create(req, res) {
    console.log("Category create is invoked...");

    const categoryData = req.body;
    const data = await CategoryModel.create(categoryData);

    res.status(201).json(data); // Send the saved object as a JSON response
      console.log(`Category is created ${data}`);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }


  async update(req, res) {
    const { id } = req.params;
    const { key1, key2 } = req.body;
    try {
      res.status(201).json(catgeoryModel.update(parseInt(id), { key1, key2 })); // Send the saved object as a JSON response
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async delete(req, res) {
    const { id } = req.params;
    try {
      res.status(201).json(catgeoryModel.delete(parseInt(id))); // Send the deleted object as a JSON response
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  
}

module.exports = new CategoryController();
