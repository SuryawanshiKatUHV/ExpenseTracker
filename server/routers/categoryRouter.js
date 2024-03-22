const express = require("express");
const router = express.Router();
const authenticator = require('../middleware/Authenticator');
const controller = require("../controllers/CategoryController");

router.get("/", authenticator, controller.getAll);

router.get("/:id", authenticator, controller.getById);

router.post("/", authenticator, controller.create);

router.put("/:id", authenticator, controller.update);

router.delete("/:id", authenticator, controller.delete);

module.exports = router;