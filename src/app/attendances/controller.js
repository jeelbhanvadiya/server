const mongoose = require("mongoose");

const attendance = mongoose.model("attendances");

exports.creatAttendance = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({
                message: "Data content can not be empty"
            });
        }
        if (req.body && !req.body.attendanceList) {
            return res.status(400).send({
                message: "Data content can not be empty"
            });
        }
        const isExist = await attendance.find({})
        if (isExist && isExist.length > 0) {
            let values = {}
            Object.keys(req.body.attendanceList).forEach((key) => {
                values[`attendanceList.${key}`] = req.body.attendanceList[key]
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
        const { name, year, month } = req.query;
        const data = await attendance.aggregate([
            {
                $project: {
                    _id: 1,
                    tasks: {
                        $objectToArray: "$attendanceList"
                    }
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "dates": {
                        "$map": {
                            "input": "$tasks",
                            "as": "ar",
                            in: {
                                "date": "$$ar.k",
                                "isPresent": `$$ar.v.employeeAttendance.${name}`,
                                "year": {$split: ["$$ar.k", "-"]}
                            }
                        }
                    }
                }
            }
        ]);
        const record = data && data.length && data[0].dates || [];
        const updatedData = (record || []).filter((date) => {
            if (date && date.year.length && date.hasOwnProperty("isPresent")) {
                const monthNumber = month.toString().padStart(2, '0');
                return date.year[2] == year && date.year[1] == monthNumber
            }
            return false
        });
        res.status(200).send(updatedData);
    } catch (err) {
        if (err.message === "$arrayToObject requires an object keys of 'k' and 'v'. Found incorrect number of keys:1") {
            res.status(500).send({message: "employee is not found"});
        } else {
            res.status(500).send({message: err.message || "Some error occurred while getting data."});
        }
    }
};

exports.getAllAttendance = async (req, res) => {
    try {
        const stock = await attendance.find({});
        res.status(200).send(stock);
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while retrieving login."});
    }
};

exports.updateAttendance = async (req, res) => {
    const {date, empName} = req.query;
    const query = `attendanceList.${date.trim()}.employeeAttendance.${empName}`;
    const data = await attendance.findOne({});
    if (data.attendanceList[date]) {
        const valueOfEmp = data.attendanceList[date] && data.attendanceList[date].employeeAttendance[empName];
        const updated = await attendance.updateMany({_id: data._id}, {$set: {[query]: !valueOfEmp}});
        if (updated && updated.ok) {
            res.status(500).send({updated: true});
        } else {
            res.status(500).send({
                message: "Some error occurred while updating the Attendance."
            });
        }
    } else {
        res.status(500).send({
            message: "Date is not found."
        });
    }
};

exports.deleteAttendance = async (req, res) => {
    try {
        await attendance.deleteOne({_id: req.params.id});
        res.status(200).send("success");
    } catch (err) {
        res.status(422).send({error: "Error in deleting data"});
    }
};