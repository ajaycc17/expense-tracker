const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const FilesDown = sequelize.define("filesDown", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    filesUrl: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = FilesDown;
