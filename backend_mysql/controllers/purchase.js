const Razorpay = require("razorpay");

const Order = require("../models/orders");
const sequelize = require("../utils/database");
const jwtServices = require("../services/jwtService");

exports.purchasePremium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RZP_KEY_ID,
            key_secret: process.env.RZP_SECRET_KEY,
        });
        const amount = 2500;

        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            req.user
                .createOrder({ orderid: order.id, status: "PENDING" })
                .then(() => {
                    return res.status(201).json({ order, key_id: rzp.key_id });
                })
                .catch((err) => {
                    throw new Error(err);
                });
        });
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: "Something went wrong", error: err });
    }
};

exports.updateTransactionStatus = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({
            where: { orderid: order_id },
            transaction: t,
        });
        await order.update(
            { payment_id: payment_id, status: "SUCCESSFUL" },
            { transaction: t }
        );
        await req.user.update({ isPremiumUser: true }, { transaction: t });

        await t.commit();
        return res.status(202).json({
            success: true,
            message: "Transaction successful",
            token: jwtServices.generateAccessTokenOnPremium(
                req.user.id,
                req.user.name,
                req.user.isPremiumUser
            ),
        });
    } catch (err) {
        await t.rollback();
        throw new Error(err);
    }
};

exports.updateFailedStatus = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({
            where: { orderid: order_id },
            transaction: t,
        });
        await order.update(
            { payment_id: payment_id, status: "FAILED" },
            { transaction: t }
        );

        await t.commit();
        res.status(400).json({ message: "Transaction failed" });
    } catch (err) {
        await t.rollback();
        throw new Error(err);
    }
};
