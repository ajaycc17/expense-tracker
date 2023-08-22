const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const expenseSchema = new Schema(
    {
        expense: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
