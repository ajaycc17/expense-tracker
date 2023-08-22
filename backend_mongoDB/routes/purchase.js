const express = require("express");

const purchaseController = require("../controllers/purchase");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get(
    "/premium",
    authMiddleware.authenticate,
    purchaseController.purchasePremium
);
router.post(
    "/update-transaction-status",
    authMiddleware.authenticate,
    purchaseController.updateTransactionStatus
);
router.post(
    "/update-failed-status",
    authMiddleware.authenticate,
    purchaseController.updateFailedStatus
);

module.exports = router;
