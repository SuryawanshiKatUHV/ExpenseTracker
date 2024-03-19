const express = require("express");
const router = express.Router();
const authenticateToken = require('./middleware/Authenticator');
const controller = require("../controllers/GroupTransactionController");

router.get("/", authenticateToken, controller.getAll);

router.get("/:id", authenticateToken, controller.getById);

router.post("/", authenticateToken, controller.create);

module.exports = router;