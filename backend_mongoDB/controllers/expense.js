const Expense = require("../models/expense");
const User = require("../models/user");
const FilesDown = require("../models/filesDown");

const s3Services = require("../services/s3service");

exports.getAllExpenses = async (req, res) => {
    const pageNum = req.query.page || 0;
    const limitRowsExp = Number(req.query.limit);
    const off = pageNum * limitRowsExp;

    const pageNumFiles = req.query.filepage || 0;
    const offFiles = pageNumFiles * 10;
    try {
        const expenses = await Expense.find({ userId: req.user._id })
            .skip(off)
            .limit(limitRowsExp)
            .sort("-createdAt");
        // get total rows count
        const totalRows = await Expense.count({ userId: req.user._id });
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
            downs = await FilesDown.find({ userId: req.user._id })
                .select("filesUrl createdAt")
                .skip(offFiles)
                .limit(10)
                .sort("-createdAt");

            // get total count of files
            totalFiles = await FilesDown.count({ userId: req.user._id });
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
        const expense = await Expense.findOne({
            _id: expId,
            userId: req.user._id,
        });
        res.status(200).json(expense);
    } catch (err) {
        res.status(404).json({ message: err });
    }
};

exports.addNewExpense = async (req, res) => {
    const expense = req.body.amount;
    const desc = req.body.desc;
    const category = req.body.category;
    try {
        const newExpense = new Expense({
            expense: expense,
            description: desc,
            category: category,
            userId: req.user._id,
        });
        await newExpense.save();
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

        req.user.totalExpense = totalExpense;
        req.user.thisDay = thisDay;
        req.user.thisMonth = thisMonth;
        req.user.thisYear = thisYear;
        req.user.currDay = today.toISOString();
        req.user.currMonth = today.getMonth();
        req.user.currYear = today.getFullYear();
        await req.user.save();

        res.status(200).json({
            success: true,
            message: "New expense added successfully.",
            data: newExpense,
        });
    } catch (err) {
        res.status(500).json({ message: err });
    }
};

exports.editExpense = async (req, res, next) => {
    const expId = req.params.itemId;
    const expense = req.body.amount;
    const desc = req.body.desc;
    const category = req.body.category;
    try {
        const item = await Expense.findOne({
            userId: req.user._id,
            _id: expId,
        });
        const oldExpense = item.expense;
        item.expense = expense;
        item.description = desc;
        item.category = category;
        await item.save();

        const user = await User.findById(req.user._id);
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

        res.status(200).json({
            success: true,
            message: "Expense edited successfully.",
            data: item,
        });
    } catch (err) {
        res.status(500).json({ message: err });
    }
};

exports.deleteExpense = async (req, res, next) => {
    const expId = req.params.itemId;
    try {
        const item = await Expense.findOneAndDelete({
            userId: req.user._id,
            _id: expId,
        });
        const oldExpense = item.expense;
        let thisCurrDay = new Date(item.createdAt);

        const user = await User.findById(req.user._id);
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

        res.status(200).json({
            success: true,
            message: "Expense deleted successfully.",
        });
    } catch (err) {
        res.status(500).json({ message: err });
    }
};

exports.downloadReport = async (req, res) => {
    try {
        //magic method
        const expenses = await Expense.find().sort("createdAt");
        // create txt file
        const stringifiedExp = JSON.stringify(expenses);
        let newTime = new Date();
        newTime = newTime.getTime();
        const fileName = `expense${req.user._id}/${newTime}.txt`;
        const fileUrl = await s3Services.uploadToS3(stringifiedExp, fileName);

        // push to db
        const newFile = new FilesDown({
            filesUrl: fileUrl,
            userId: req.user._id,
        });
        await newFile.save();

        // return response
        res.status(200).json({
            fileUrl,
            success: true,
        });
    } catch (err) {
        res.status(500).json({ fileUrl: "", success: false, message: err });
    }
};
