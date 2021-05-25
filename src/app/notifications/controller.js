const mongoose = require("mongoose");

const notificationSchema = mongoose.model("notifications");

exports.creatNotifications = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({
                message: "Data content can not be empty"
            });
        }
        if(req.body && !req.body.notificationList){
            return res.status(400).send({
                message: "Data content can not be empty"
            });
        }
        const isExist = await notificationSchema.find({})
        console.log(isExist[0].notificationList);
        if (isExist && isExist.length > 0) {
            const data = await notificationSchema.updateOne({notificationList : isExist[0].notificationList})
            if (data && data.ok) {
                res.status(500).send({updated: true});
            } else {
                res.status(500).send({
                    message: "Some error occurred while updating the Notifications."
                });
            }
        } else {
            notificationSchema.create(req.body)
                .then(data => {
                    res.status(200).send({data, message: "successfully Created Notifications"});
                }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the Notifications."
                });
            });
        }
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
}