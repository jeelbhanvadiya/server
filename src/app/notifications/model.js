const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
    {
        notificationList: { type: Object }
    },
    {
            timestamps: true,
    }
);

module.exports = mongoose.model("notifications", notificationSchema);

