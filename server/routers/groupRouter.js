const express = require("express");
const router = express.Router();
const authenticateToken = require('./middleware/Authenticator');
const controller = require("../controllers/GroupController");

router.get("/", authenticateToken, controller.getAll);

router.get("/:id", authenticateToken, controller.getById);

router.post("/", authenticateToken, controller.create);

router.put("/:id", authenticateToken, controller.update);

router.delete("/:id", authenticateToken, controller.delete);

module.exports = router;