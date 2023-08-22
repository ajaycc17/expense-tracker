const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const ForgotPasswordRequests = sequelize.define("forgotPassReq", {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    isActive: Sequelize.BOOLEAN,
});

module.exports = ForgotPasswordRequests;
