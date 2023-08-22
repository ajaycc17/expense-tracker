const express = require("express");

const premiumController = require("../controllers/premium");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get(
    "/get-leaderboard",
    authMiddleware.authenticate,
    premiumController.leaderBoard
);

module.exports = router;
