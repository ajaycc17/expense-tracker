const User = require("../models/user");

exports.leaderBoard = async (req, res) => {
    try {
        // using custom field in user table
        const pageNum = req.query.page || 0;
        const off = pageNum * 10;
        if (req.user.isPremiumUser) {
            const leaderBoardData = await User.findAll({
                attributes: ["id", "name", "totalExpense"],
                offset: off,
                limit: 10,
                order: [["totalExpense", "DESC"]],
            });
            const totalUsers = await User.count();
            res.status(200).json({
                data: leaderBoardData,
                totalUsers: totalUsers,
            });
        } else {
            res.status(403).json({
                message: "Subscribe for premium features.",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: "Something went wrong", error: err });
    }
};
