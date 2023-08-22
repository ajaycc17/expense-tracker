const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const User = sequelize.define("user", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isPremiumUser: Sequelize.BOOLEAN,
    totalExpense: { type: Sequelize.DOUBLE, defaultValue: 0 },
    currMonth: Sequelize.INTEGER,
    currDay: Sequelize.DATE,
    currYear: Sequelize.INTEGER,
    thisDay: Sequelize.DOUBLE,
    thisMonth: Sequelize.DOUBLE,
    thisYear: Sequelize.DOUBLE,
});

module.exports = User;
