const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
    {
        title: {type: String},
        content: {type: String},
        isRead: {type: Boolean},
        date: {type: Date}
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("notifications", notificationSchema);

