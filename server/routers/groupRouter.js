const express = require("express");
const router = express.Router();
const authenticator = require('../middleware/Authenticator');
const controller = require("../controllers/GroupController");

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
router.get("/:id/members", authenticator, controller.getMembers);

router.get("/:id/transactions", authenticator, controller.getTransactions);

router.get("/:id/settlementSummary", authenticator, controller.getSettlementSummary);

module.exports = router;