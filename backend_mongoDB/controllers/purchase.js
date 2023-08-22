const Razorpay = require("razorpay");

const Order = require("../models/orders");
const User = require("../models/user");
const jwtServices = require("../services/jwtService");

exports.purchasePremium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RZP_KEY_ID,
            key_secret: process.env.RZP_SECRET_KEY,
        });
        const amount = 2500;

        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            try {
                const newOrder = Order({
                    orderid: order.id,
                    status: "PENDING",
                    userId: req.user._id,
                });
                await newOrder.save();

                return res.status(201).json({ order, key_id: rzp.key_id });
            } catch (err) {
                throw new Error(err);
            }
        });
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: "Something went wrong", error: err });
    }
};

exports.updateTransactionStatus = async (req, res) => {
    try {
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ orderid: order_id });
        order.payment_id = payment_id;
        order.status = "SUCCESSFUL";
        await order.save();

        const user = await User.findById(req.user._id);
        user.isPremiumUser = true;
        await user.save();

        return res.status(202).json({
            success: true,
            message: "Transaction successful",
            token: jwtServices.generateAccessTokenOnPremium(
                req.user._id,
                req.user.name,
                req.user.isPremiumUser
            ),
        });
    } catch (err) {
        throw new Error(err);
    }
};

exports.updateFailedStatus = async (req, res) => {
    try {
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ orderid: order_id });
        order.payment_id = payment_id;
        order.status = "FAILED";
        await order.save();

        res.status(400).json({ message: "Transaction failed" });
    } catch (err) {
        throw new Error(err);
    }
};
