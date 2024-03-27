const express = require("express");
const router = express.Router();
const authenticator = require('../middleware/authenticator');
const controller = require("../controllers/CategoryController");

/**
 * Basic services
 */
router.get("/", authenticator, controller.getAll);

router.get("/:id", authenticator, controller.getById);

router.post("/", authenticator, controller.create);

router.put("/:id", authenticator, controller.update);

router.delete("/:id", authenticator, controller.delete);

/**
 * Extended services
 */
router.get("/:id/transactions", authenticator, controller.getTransactions);

router.get("/:id/budgets", authenticator, controller.getBudgets);

module.exports = router;