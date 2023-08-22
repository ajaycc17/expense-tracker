const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        isPremiumUser: {
            type: Boolean,
            default: false,
        },
        totalExpense: { type: Number, default: 0 },
        currMonth: Number,
        currDay: Date,
        currYear: Number,
        thisDay: Number,
        thisMonth: Number,
        thisYear: Number,
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
