const express = require("express");
const router = express.Router();
const authenticator = require('../middleware/authenticator');
const controller = require("../controllers/User");

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

router.get("/:id/budgets", authenticator, controller.getBudgets);

router.get("/:id/transactions", authenticator, controller.getTransactions);

router.get("/:id/transactions/yearMonthRange", authenticator, controller.getTransactionsYearMonthRange);

router.get("/:id/transactions/:type/:year/:month/summary", authenticator, controller.getTransactionsSummary);

router.get("/:id/groups", authenticator, controller.getGroups);

router.get("/:userId/groups/:groupId/paidTransactions", authenticator, controller.getGroupTransactionsPaid);

router.get("/:userId/groups/:groupId/receivedTransactions", authenticator, controller.getGroupTransactionsReceived);

router.get("/:id/groupTransactions/moneyOwedToMe", authenticator, controller.getGroupTransactionsMoneyOwedToMe);

router.get("/:id/groupTransactions/moneyINeedToPay", authenticator, controller.getGroupTransactionsMoneyINeedToPay);

module.exports = router;