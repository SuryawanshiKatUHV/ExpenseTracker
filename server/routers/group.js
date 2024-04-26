const express = require("express");
const router = express.Router();
const authenticator = require('../middleware/authenticator');
const controller = require("../controllers/Group");

/**
 * Basic services
 */
router.get("/", authenticator, controller.getAll);

router.get("/:id", authenticator, controller.getById);

router.post("/", authenticator, controller.create);

router.put("/:userGroupId", authenticator, controller.update);

router.delete("/:userGroupId", authenticator, controller.delete);

/**
 * Extended services
 */
router.get("/:id/members", authenticator, controller.getMembers);

router.get("/:id/transactions", authenticator, controller.getTransactions);

router.get("/:id/settlementSummary", authenticator, controller.getSettlementSummary);

module.exports = router;