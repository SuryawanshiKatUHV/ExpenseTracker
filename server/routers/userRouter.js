const express = require("express");
const router = express.Router();
const authenticator = require('../middleware/Authenticator');
const controller = require("../controllers/UserController");

/**
 * User basic services
 */
router.get("/", authenticator, controller.getAll);

router.get("/:id", authenticator, controller.getById);

router.post("/", controller.create);

router.post("/login", controller.login);

router.put("/:id", authenticator, controller.update);

router.delete("/:id", authenticator, controller.delete);

/**
 * User extended services
 */
router.get("/:id/categories", authenticator, controller.getCategories);

router.get("/:id/transactions", authenticator, controller.getTransactions);

router.get("/:id/groups", authenticator, controller.getGroups);

router.get("/:userId/groups/:groupId/paidTransactions", authenticator, controller.getGroupTransactionsPaid);

router.get("/:userId/groups/:groupId/receivedTransactions", authenticator, controller.getGroupTransactionsReceived);

module.exports = router;