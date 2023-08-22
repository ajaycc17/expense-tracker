const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const filesDownSchema = new Schema(
    {
        filesUrl: {
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

module.exports = mongoose.model("FilesDown", filesDownSchema);
