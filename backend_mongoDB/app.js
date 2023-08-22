const fs = require("fs");
const path = require("path");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
// const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const adminRoutes = require("./routes/admin");
const expenseRoutes = require("./routes/expense");
const passwordRoutes = require("./routes/password");
const premiumRoutes = require("./routes/premium");
const purchaseRoutes = require("./routes/purchase");

const app = express();

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "access.log"),
    { flags: "a" }
);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));
// app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));

app.use("/user", adminRoutes);
app.use("/expense", expenseRoutes);
app.use("/password", passwordRoutes);
app.use("/premium", premiumRoutes);
app.use("/purchase", purchaseRoutes);

const mongoUser = process.env.MONGO_USER;
const mongoPass = process.env.MONGO_PASS;
mongoose
    .connect(
        `mongodb+srv://${mongoUser}:${mongoPass}@learn.gfpxaqo.mongodb.net/expensetracker?retryWrites=true&w=majority`
    )
    .then(() => {
        app.listen(3000);
    })
    .catch((err) => console.log(err));
