const express = require("express");

const expenseController = require("../controllers/expense");
const userAuth = require("../middleware/auth");

const router = express.Router();

router.get("/", userAuth.authenticate, expenseController.getAllExpenses);
router.get(
    "/get-expense/:itemId",
    userAuth.authenticate,
    expenseController.getOneExpense
);
router.get(
    "/download",
    userAuth.authenticate,
    expenseController.downloadReport
);
router.post(
    "/add-expense",
    userAuth.authenticate,
    expenseController.addNewExpense
);
router.post(
    "/edit-expense/:itemId",
    userAuth.authenticate,
    expenseController.editExpense
);
router.post(
    "/delete-expense/:itemId",
    userAuth.authenticate,
    expenseController.deleteExpense
);

module.exports = router;
