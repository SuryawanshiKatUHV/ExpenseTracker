const Joi = require("joi");

class UserModel {
  dummyData = [
    { id: 1, fname: "fname1", lname: "lname1" },
    { id: 2, fname: "fname2", lname: "lname2" },
    { id: 3, fname: "fname3", lname: "lname3" },
    { id: 4, fname: "fname4", lname: "lname4" },
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

  create({ fname, lname }) {
    this._validate({ fname, lname });

    const user = { id: ++this.idCounter, fname: fname, lname: lname };
    this.dummyData.push(user);
    return user;
  }

  update(id, { fname, lname }) {
    this._validate({ fname, lname });

    const user = this.dummyData.find((u) => u.id === id);
    if (!user) {
      throw { message: `No record found with id ${id}` };
    }

    user.fname = fname;
    user.lname = lname;

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
      fname: Joi.string().required().min(3),
      lname: Joi.string().required().min(3),
    });

    const validateResult = schema.validate(user);
    if (validateResult.error) {
      console.log(validateResult.error);
      throw validateResult.error;
    }
  }
}

module.exports = new UserModel();
