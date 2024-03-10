const Joi = require("joi");

class UserModel {
  dummyData = [
    { id: 1, firstName: "firstName", lastName:"lastName", email:"email@domain.com", password:"password"}
  ];
  idCounter = this.dummyData.length;

  getAll() {
    return this.dummyData;
  }

  getById(id) {
    const user = this.dummyData.find((u) => u.id === id);
    if (!user) {
      throw { message: `No record found with id ${id}` };
    }
    return user;
  }

  create({ email, firstName, lastName, password }) {
    this._validate({ email, firstName, lastName, password });

    const user = { id: ++this.idCounter, email, firstName, lastName, password };
    this.dummyData.push(user);
    return user;
  }

  login({ email, password }) {
    this._validate({ email, password });

    const user = this.dummyData.find((u) => u.email === email && u.password === password);
    if (!user) {
      throw new Error(`Authentication failed.`);
    }
    return user;
  }

  update(id, { firstName, lastName }) {
    this._validate({ firstName, lastName });

    const user = this.dummyData.find((u) => u.id === id);
    if (!user) {
      throw { message: `No record found with id ${id}` };
    }

    user.firstName = firstName;
    user.lastName = lastName;

    return user;
  }

  delete(id) {
    const user = this.dummyData.find((u) => u.id === id);
    if (!user) {
      throw { message: `No record found with id ${id}` };
    }
    const index = this.dummyData.indexOf(user);
    this.dummyData.splice(index, 1);
    return user;
  }

  _validate(user) {
    const schema = Joi.object({
      email: Joi.string().required().min(3).max(50),
      firstName: Joi.string().required().min(3).max(50),
      lastName: Joi.string().required().min(3).max(50),
      password: Joi.string().required().min(3).max(50),
    });

    const validateResult = schema.validate(user);
    if (validateResult.error) {
      console.log(validateResult.error);
      throw new Error(validateResult.error);
    }
  }
}

module.exports = new UserModel();
