const express = require("express");
const router = express.Router();
const authenticator = require('../middleware/Authenticator');
const controller = require("../controllers/GroupTransactionController");

router.get("/", authenticator, controller.getAll);

router.get("/:id", authenticator, controller.getById);

router.post("/", authenticator, controller.create);

module.exports = router;