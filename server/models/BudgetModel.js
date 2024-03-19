const Joi = require("joi");

class BudgetModel {
  getAll() {
    throw new Error(`To be implemented`);
  }

  getById(id) {
    throw new Error(`To be implemented`);
  }

  create({ key1, key2 }) {
    throw new Error(`To be implemented`);
  }

  update(id, { key1, key2 }) {
    throw new Error(`To be implemented`);
  }

  delete(id) {
    throw new Error(`To be implemented`);
  }

  _validate(user) {
    const schema = Joi.object({
      key1: Joi.string().required().min(3),
      key2: Joi.string().required().min(3),
    });

    const validateResult = schema.validate(user);
    if (validateResult.error) {
      console.log(validateResult.error);
      throw validateResult.error;
    }
  }
}

module.exports = new BudgetModel();
