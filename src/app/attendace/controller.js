const mongoose = require("mongoose");

const attendance = mongoose.model("attendanceSchema");

exports.creatAttendance = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({
                message: "Data content can not be empty"
            });
        }
        if(req.body && !req.body.attendanceList){
            return res.status(400).send({
                message: "Data content can not be empty"
            });
        }
        const isExist = await attendance.find({})
        if (isExist && isExist.length > 0) {
            let values = {attendanceList: {}}
            Object.keys(req.body.attendanceList).forEach((key) => {
                values['attendanceList'][key] = req.body.attendanceList[key]
            })
            const data = await attendance.updateOne({_id: isExist[0]._id}, {$set: values})
            if (data && data.ok) {
                res.status(500).send({updated: true});
            } else {
                res.status(500).send({
                    message: "Some error occurred while updating the Attendance."
                });
            }
        } else {
            attendance.create(req.body)
                .then(data => {
                    res.status(200).send({data, message: "successfully Created Attendance"});
                }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the Attendance."
                });
            });
        }
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while create Attendance."});
    }
};

exports.getAttendance = async (req, res) => {
    try {
        const data = await attendance.find({});
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while getting data."});
    }
};

exports.updateAttendance = async (req, res) => {

};

exports.deleteAttendance = async (req, res) => {
    try {
        await attendance.deleteOne({_id: req.params.id})
        res.status(200).send("success");
    } catch (err) {
        res.status(422).send({error: "Error in deleting data"});
    }
}