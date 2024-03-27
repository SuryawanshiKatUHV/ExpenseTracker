const express = require("express");
const router = express.Router();
const authenticator = require('../middleware/authenticator');
const controller = require("../controllers/TransactionController");

router.get("/", authenticator, controller.getAll);

router.get("/:id", authenticator, controller.getById);

router.post("/", authenticator, controller.create);

router.put("/:id", authenticator, controller.update);

router.delete("/:id", authenticator, controller.delete);

module.exports = router;