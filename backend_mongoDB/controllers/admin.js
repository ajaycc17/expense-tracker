const bcrypt = require("bcrypt");

const User = require("../models/user");
const jwtServices = require("../services/jwtService");

exports.signUp = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findOne({ email: email });
        if (user === null) {
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    console.log(err);
                }
                const newUser = new User({
                    name: name,
                    email: email,
                    password: hash,
                });
                await newUser.save();

                res.status(201).json({
                    success: true,
                    message: "New user created.",
                });
            });
        } else {
            res.status(403).json({
                message: "User with this email id already exists!",
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.logIn = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findOne({ email: email });
        if (user !== null) {
            bcrypt.compare(password, user.password, async (err, result) => {
                if (result) {
                    res.status(200).json({
                        success: true,
                        message: "Successfully logged in.",
                        token: jwtServices.generateAccessTokenOnLogin(
                            user._id,
                            user.name
                        ),
                    });
                } else {
                    return res.status(400).json({
                        success: false,
                        message: "Incorrect password.",
                    });
                }
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "User with this email id does not exist.",
            });
        }
    } catch (err) {
        res.status(500).json({ message: err, success: false });
    }
};
