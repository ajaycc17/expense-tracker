const fs = require("fs");
const path = require("path");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config({ path: "../.env" });

const Expense = require("./models/expense");
const User = require("./models/user");
const Order = require("./models/orders");
const ForgotPasswordRequests = require("./models/forgotPass");
const FilesDown = require("./models/filesDown");

const sequelize = require("./utils/database");
const adminRoutes = require("./routes/admin");
const expenseRoutes = require("./routes/expense");
const purchaseRoutes = require("./routes/purchase");
const premiumRoutes = require("./routes/premium");
const passwordRoutes = require("./routes/password");

const app = express();

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "access.log"),
    { flags: "a" }
);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));
app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));

app.use("/user", adminRoutes);
app.use("/expense", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumRoutes);
app.use("/password", passwordRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(User);

User.hasMany(FilesDown);
FilesDown.belongsTo(User);

sequelize
    // .sync({ force: true })
    .sync()
    .then((res) => {
        app.listen(3000);
        // app.listen(process.env.PORT || 3000);
    })
    .catch((err) => console.log(err));
