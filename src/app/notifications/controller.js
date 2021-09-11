const mongoose = require("mongoose");

const notificationSchema = mongoose.model("notifications");

exports.creatNotifications = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({
                message: "Data content can not be empty"
            });
        }
        const stock = await notificationSchema.create(req.body);
        res.status(200).send(stock);
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while create notification."});
    }
};

exports.getAllNotifications = async (req, res) => {
    try {
        const stock = await notificationSchema.find({});
        res.status(200).send(stock);
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while retrieving Notifications."});
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        await notificationSchema.deleteOne({_id: req.params.id})
        res.status(200).send("success");
    } catch (err) {
        res.status(422).send({error: "Error in deleting Notification"});
    }
};