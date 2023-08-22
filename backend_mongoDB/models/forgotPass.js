const mongoose = require("mongoose");
const { UUID } = require("sequelize");

const Schema = mongoose.Schema;

const forgotPassSchema = new Schema(
    {
        reqId: {
            type: UUID,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        isActive: Boolean,
    },
    { timestamps: true }
);

module.exports = mongoose.model("ForgotPassReq", forgotPassSchema);
