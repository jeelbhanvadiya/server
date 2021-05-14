const mongoose = require("mongoose");

const attendance = mongoose.model("attendanceSchema");

exports.creatAttendance = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({
                message: "Data content can not be empty"
            });
        }
        attendance.create(req.body)
            .then(data => {
                res.status(200).send({data, message: "successfully Created Attendance"});
            }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Attendance."
            });
        });
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
    } catch(err) {
        res.status(422).send({error: "Error in deleting data"});
    }
}