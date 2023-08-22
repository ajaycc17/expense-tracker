const Expense = require("../models/expense");
const User = require("../models/user");
const FilesDown = require("../models/filesDown");

const sequelize = require("../utils/database");
const s3Services = require("../services/s3service");

exports.getAllExpenses = async (req, res) => {
    const pageNum = req.query.page || 0;
    const limitRowsExp = Number(req.query.limit);
    const off = pageNum * limitRowsExp;

    const pageNumFiles = req.query.filepage || 0;
    const offFiles = pageNumFiles * 10;
    try {
        const expenses = await req.user.getExpenses({
            order: [["createdAt", "DESC"]],
            offset: off,
            limit: limitRowsExp,
        });
        // get total rows count
        const totalRows = await Expense.count({
            where: {
                userId: req.user.id,
            },
        });
        // get thisday data
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        let thisCurrDay = new Date(req.user.currDay);
        thisCurrDay.setHours(0, 0, 0, 0);
        let thisDay = 0,
            thisMonth = 0,
            thisYear = 0;

        if (thisCurrDay.toDateString() === today.toDateString()) {
            thisDay = req.user.thisDay;
        }
        if (
            req.user.currMonth === today.getMonth() &&
            req.user.currYear === today.getFullYear()
        ) {
            thisMonth = req.user.thisMonth;
        }
        if (req.user.currYear === today.getFullYear()) {
            thisYear = req.user.thisYear;
        }

        // download reports
        let downs, totalFiles;
        if (req.user.isPremiumUser) {
            downs = await FilesDown.findAll({
                attributes: ["filesUrl", "createdAt"],
                order: [["createdAt", "DESC"]],
                offset: offFiles,
                limit: 10,
                where: { userId: req.user.id },
            });
            // get total count of files
            totalFiles = await FilesDown.count({
                where: { userId: req.user.id },
            });
        }
        // return response
        res.status(200).json({
            isPremium: req.user.isPremiumUser,
            data: expenses,
            totalRows: totalRows,
            thisDay: thisDay,
            thisMonth: thisMonth,
            thisYear: thisYear,
            totalExpense: req.user.totalExpense,
            filesDown: downs,
            totalFiles: totalFiles,
        });
    } catch (err) {
        res.status(500).json({ message: err });
    }
};

exports.getOneExpense = async (req, res) => {
    const expId = req.params.itemId;
    try {
        const expenses = await req.user.getExpenses({ where: { id: expId } });
        const expense = expenses[0];
        res.status(200).json(expense);
    } catch (err) {
        res.status(404).json({ message: err });
    }
};

exports.addNewExpense = async (req, res) => {
    const t = await sequelize.transaction();
    const expense = req.body.amount;
    const desc = req.body.desc;
    const category = req.body.category;
    try {
        const newExpense = await Expense.create(
            {
                expense: expense,
                description: desc,
                category: category,
                userId: req.user.id,
            },
            { transaction: t }
        );
        const totalExpense = Number(req.user.totalExpense) + Number(expense);

        let today = new Date();
        today.setHours(0, 0, 0, 0);
        let thisCurrDay = new Date(req.user.currDay);
        thisCurrDay.setHours(0, 0, 0, 0);
        let thisDay = expense,
            thisMonth = expense,
            thisYear = expense;
        if (thisCurrDay.toDateString() === today.toDateString()) {
            thisDay = req.user.thisDay + Number(expense);
        }
        if (
            req.user.currMonth === today.getMonth() &&
            req.user.currYear === today.getFullYear()
        ) {
            thisMonth = req.user.thisMonth + Number(expense);
        }
        if (req.user.currYear === today.getFullYear()) {
            thisYear = req.user.thisYear + Number(expense);
        }
        await User.update(
            {
                totalExpense: totalExpense,
                thisDay: thisDay,
                thisMonth: thisMonth,
                thisYear: thisYear,
                currDay: today.toISOString(),
                currMonth: today.getMonth(),
                currYear: today.getFullYear(),
            },
            {
                where: { id: req.user.id },
                transaction: t,
            }
        );

        await t.commit();
        res.status(200).json({
            success: true,
            message: "New expense added successfully.",
            data: newExpense,
        });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ message: err });
    }
};

exports.editExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    const expId = req.params.itemId;
    const expense = req.body.amount;
    const desc = req.body.desc;
    const category = req.body.category;
    try {
        const items = await req.user.getExpenses({
            where: { id: expId },
            transaction: t,
        });
        const item = items[0];
        const oldExpense = item.expense;
        item.expense = expense;
        item.description = desc;
        item.category = category;
        await item.save();

        const user = await User.findOne({
            where: { id: req.user.id },
            transaction: t,
        });
        user.totalExpense = user.totalExpense - oldExpense + Number(expense);
        // edit thid day data
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        let thisCurrDay = new Date(item.createdAt);
        thisCurrDay.setHours(0, 0, 0, 0);

        if (thisCurrDay.toDateString() === today.toDateString()) {
            user.thisDay += Number(expense) - oldExpense;
        }
        if (
            user.currMonth === today.getMonth() &&
            user.currYear === today.getFullYear()
        ) {
            user.thisMonth += Number(expense) - oldExpense;
        }
        if (user.currYear === today.getFullYear()) {
            user.thisYear += Number(expense) - oldExpense;
        }

        await user.save();
        await t.commit();

        res.status(200).json({
            success: true,
            message: "Expense edited successfully.",
            data: item,
        });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ message: err });
    }
};

exports.deleteExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    const expId = req.params.itemId;
    try {
        const items = await req.user.getExpenses({
            where: { id: expId },
            transaction: t,
        });
        const item = items[0];
        const oldExpense = item.expense;
        let thisCurrDay = new Date(item.createdAt);
        await item.destroy();

        const user = await User.findOne({
            where: { id: req.user.id },
            transaction: t,
        });
        user.totalExpense = user.totalExpense - oldExpense;
        // edit thid day data
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        thisCurrDay.setHours(0, 0, 0, 0);

        if (thisCurrDay.toDateString() === today.toDateString()) {
            user.thisDay -= Number(oldExpense);
        }
        if (
            user.currMonth === today.getMonth() &&
            user.currYear === today.getFullYear()
        ) {
            user.thisMonth -= Number(oldExpense);
        }
        if (user.currYear === today.getFullYear()) {
            user.thisYear -= Number(oldExpense);
        }
        await user.save();

        await t.commit();
        res.status(200).json({
            success: true,
            message: "Expense deleted successfully.",
        });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ message: err });
    }
};

exports.downloadReport = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        //magic method
        const expenses = await req.user.getExpenses({
            order: [["createdAt", "ASC"]],
            transaction: t,
        });
        // create txt file
        const stringifiedExp = JSON.stringify(expenses);
        let newTime = new Date();
        newTime = newTime.getTime();
        const fileName = `expense${req.user.id}/${newTime}.txt`;
        const fileUrl = await s3Services.uploadToS3(stringifiedExp, fileName);

        // push to db
        await FilesDown.create(
            {
                filesUrl: fileUrl,
                userId: req.user.id,
            },
            { transaction: t }
        );
        await t.commit();
        // return response
        res.status(200).json({
            fileUrl,
            success: true,
        });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ fileUrl: "", success: false, message: err });
    }
};
