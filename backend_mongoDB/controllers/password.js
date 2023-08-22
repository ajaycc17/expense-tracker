const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const Sib = require("sib-api-v3-sdk");

const ForgotPasswordRequests = require("../models/forgotPass");
const User = require("../models/user");

exports.forgotPass = async (req, res) => {
    const emailId = req.body.email;
    const newUuid = uuidv4();
    try {
        const user = await User.findOne({ email: emailId });
        // store in table
        const newReq = new ForgotPasswordRequests({
            reqId: newUuid,
            userId: user._id,
            isActive: true,
        });
        await newReq.save();
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
        res.json({ message: error });
    }
};

exports.resetPass = async (req, res) => {
    const reqId = req.params.resetuuid;
    try {
        const request = await ForgotPasswordRequests.findOne({ reqId: reqId });
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
    const newPass = req.body.setPass;
    const theUuid = req.body.theUuid;
    try {
        const request = await ForgotPasswordRequests.findOne({
            reqId: theUuid,
        });
        if (request !== null) {
            if (request.isActive) {
                const userId = request.userId;
                const saltRounds = 10;
                bcrypt.hash(newPass, saltRounds, async (err, hash) => {
                    if (err) {
                        console.log(err);
                    }
                    const user = await User.findById(userId);
                    user.password = hash;
                    await user.save();

                    request.isActive = false;
                    await request.save();

                    res.status(201).redirect(process.env.LOGIN_LINK);
                });
            }
        }
    } catch (err) {
        res.json({ message: err });
    }
};
