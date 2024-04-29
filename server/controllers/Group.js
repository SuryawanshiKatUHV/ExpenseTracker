const repository = require("../repositories/Group");

class Group {

  async getAll(req, res) {
    console.log("User Group getAll is invoked...");
    try {
      const data = await repository.getAll();

      res.status(200).json(data); // Send the saved object as a JSON response
      console.log(`User Groups found ${data}`);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
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
    console.log("User Group create is invoked...");
    try {
      const userGroupData = req.body;
      const data = await repository.create(userGroupData);

      res.status(201).json(data); // Send the saved object as a JSON response
      console.log(`User Group is created ${data}`);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    console.log("Group update is invoked");

    try {
      const{userGroupId} = req.params;
      console.log("id=", userGroupId);

      const { USER_GROUP_DATE, USER_GROUP_TITLE, USER_GROUP_DESCRIPTION, USER_GROUP_MEMBERS} = req.body;
      console.log(`USER_GROUP_DATE=${USER_GROUP_DATE} USER_GROUP_TITLE=${USER_GROUP_TITLE} USER_GROUP_DESCRIPTION=${USER_GROUP_DESCRIPTION}`);
      console.log(`USER_GROUP_MEMBERS=${USER_GROUP_MEMBERS}`);

      const data = await repository.update(parseInt(userGroupId), {USER_GROUP_DATE, USER_GROUP_TITLE, USER_GROUP_DESCRIPTION, USER_GROUP_MEMBERS});

      res.status(201).json(data);
    }catch (error) {
      console.error(error.message);
      res.status(500).json({message: error.message});
    }
  }

  async delete(req, res) {
    console.log("Group delete is invoked...");
    try {
      const { userGroupId } = req.params;
      console.log("id=", userGroupId);
      console.log("params=", req.params);
      console.log("Requested URL:", req.originalUrl);

      const data = await repository.delete(parseInt(userGroupId));

      res.status(201).json(data); // Send the saved object as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }
  
  async getMembers(req, res) {
    const { id } = req.params;
    try {
      const data = await repository.getMembers(parseInt(id));
      console.log(`data=${JSON.stringify(data)}`);

      res.status(200).json(data); // Send the retrieved object as a JSON response
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

  async getSettlementSummary(req, res) {
    const { id } = req.params;
    try {
      const data = await repository.getSettlementSummary(parseInt(id));
      console.log(`data=${JSON.stringify(data)}`);

      res.status(200).json(data); // Send the retrieved object as a JSON response
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

}

module.exports = new Group();
