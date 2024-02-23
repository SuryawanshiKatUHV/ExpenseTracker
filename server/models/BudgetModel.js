const Joi = require("joi");

class BudgetModel {
  dummyData = [
  ];
  idCounter = this.dummyData.length;

  getAll() {
    return this.dummyData;
  }

  getById(id) {
    throw { message: `To be implemented` };
  }

  create({ key1, key2 }) {
    throw { message: `To be implemented` };
  }

  update(id, { key1, key2 }) {
    throw { message: `To be implemented` };
  }

  delete(id) {
    throw { message: `To be implemented` };
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
