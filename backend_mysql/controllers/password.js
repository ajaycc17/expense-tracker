const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const Sib = require("sib-api-v3-sdk");

const ForgotPasswordRequests = require("../models/forgotPass");
const sequelize = require("../utils/database");
const User = require("../models/user");

exports.forgotPass = async (req, res) => {
    const t = await sequelize.transaction();
    const emailId = req.body.email;
    const newUuid = uuidv4();
    try {
        const user = await User.findOne({
            where: { email: emailId },
            transaction: t,
        });
        // store in table
        await ForgotPasswordRequests.create(
            {
                id: newUuid,
                userId: user.id,
                isActive: true,
            },
            { transaction: t }
        );
        // generate a link
        const resetLink = process.env.RESET_PASS_LINK + newUuid;

        // email client
        Sib.ApiClient.instance.authentications["api-key"].apiKey =
            process.env.SIB_API;

        new Sib.TransactionalEmailsApi()
            .sendTransacEmail({
                subject: "Password reset link from Expense Tracker!",
                sender: {
                    email: process.env.MY_EMAIL,
                    name: "Expense Tracker",
                },
                replyTo: {
                    email: process.env.MY_EMAIL,
                    name: "Expense Tracker",
                },
                to: [{ name: user.name, email: emailId }],
                textContent:
                    "This is your link to reset password: {{params.resetLink}}",
                params: { resetLink: resetLink },
            })
            .then(
                async () => {
                    await t.commit();
                    res.json({
                        message: "Link sent to the email.",
                        success: true,
                    });
                },
                function (error) {
                    console.error(error);
                }
            );
    } catch (error) {
        await t.rollback();
        res.json({ message: error });
    }
};

exports.resetPass = async (req, res) => {
    const reqId = req.params.resetuuid;
    try {
        const request = await ForgotPasswordRequests.findOne({
            where: { id: reqId },
        });
        if (request !== null) {
            if (request.isActive) {
                res.send(
                    `<form action='/password/change-pass' method='POST'><input type='password' name='setPass' id='setPass' required><input type='hidden' name='theUuid' id='theUuid' value=${reqId}><input type='submit' value='Reset'></form>`
                );
            }
        }
    } catch (err) {
        res.json({ message: err });
    }
};

exports.changePass = async (req, res) => {
    const t = await sequelize.transaction();
    const newPass = req.body.setPass;
    const theUuid = req.body.theUuid;
    try {
        const request = await ForgotPasswordRequests.findOne({
            where: { id: theUuid },
            transaction: t,
        });
        if (request !== null) {
            if (request.isActive) {
                const userId = request.userId;
                const saltRounds = 10;
                bcrypt.hash(newPass, saltRounds, async (err, hash) => {
                    if (err) {
                        console.log(err);
                    }
                    const user = await User.findOne({
                        where: { id: userId },
                        transaction: t,
                    });
                    user.password = hash;
                    await user.save();

                    request.isActive = false;
                    await request.save();

                    await t.commit();
                    res.status(201).redirect(process.env.LOGIN_LINK);
                });
            }
        }
    } catch (err) {
        await t.rollback();
        res.json({ message: err });
    }
};
