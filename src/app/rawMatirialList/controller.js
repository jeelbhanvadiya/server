const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId

const rawmatiriallist = mongoose.model("rawmatiriallist");

const checkAndAddSubType = (list) => {
    Object.keys(list).map((type) => {
        if(list[type] && list[type].hasSubTypes){
            if(!list[type].subTypes.length){
                list[type].subTypes = []
            }
        }
    })
};



exports.creatType = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({
                message: "Data content can not be empty"
            });
        }
        if(req.body && !req.body.materialList){
            return res.status(400).send({
                message: "Data content can not be empty"
            });
        }
        const { materialList } = req.body
        const isExist = await rawmatiriallist.find({})
        if (isExist && isExist.length > 0) {
            let values = {}
            checkAndAddSubType(materialList)
            Object.keys(req.body.materialList).forEach((key) => {
                values[`materialList.${key}`]= req.body.materialList[key]
            })
            const data = await rawmatiriallist.updateOne({_id: isExist[0]._id},{$set: values})
            if (data && data.ok) {
                res.status(500).send({updated: true});
            } else {
                res.status(500).send({
                    message: "Some error occurred while updating the Attendance."
                });
            }
        } else {
            checkAndAddSubType(materialList)
            rawmatiriallist.create(req.body)
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

exports.getType = async (req, res) => {
    try {
     const { name } = req.query
        const data = await rawmatiriallist.aggregate([
            {
                $project: {
                    _id: 1,
                    tasks: {
                        $objectToArray: "$attendanceList"
                    }
                }
            },
            {
                $project: {
                    dates: {
                        $arrayToObject: {
                            $map: {
                                input: "$tasks",
                                in: {
                                    "k": "$$this.k",
                                    "v": `$$this.v.employeeAttendance.${name}`
                                }
                            }
                        }
                    }
                }
            }
        ]);
        res.status(200).send(data);
    } catch (err) {
        if(err.message === "$arrayToObject requires an object keys of 'k' and 'v'. Found incorrect number of keys:1"){
            res.status(500).send({message: "employee is not found"});
        }else {
            res.status(500).send({message: err.message || "Some error occurred while getting data."});
        }
    }
};

exports.getAllTypes = async (req, res) => {
    try {
        const stock = await rawmatiriallist.find({});
        res.status(200).send(stock);
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while retrieving login."});
    }
};

exports.updateType = async (req, res) => {
    const { type, empName } = req.query
    const query = `materialList.${date.trim()}.employeeAttendance.${empName}`
    const data = await rawmatiriallist.findOne({})
    if(data.attendanceList[date]){
        const valueOfEmp  = data.attendanceList[date] && data.attendanceList[date].employeeAttendance[empName]
        const updated = await attendance.updateMany({_id: data._id},{$set: {[query] : !valueOfEmp}})
        if (updated && updated.ok) {
            res.status(500).send({updated: true});
        } else {
            res.status(500).send({
                message: "Some error occurred while updating the Attendance."
            });
        }
    }else {
        res.status(500).send({
            message: "Date is not found."
        });
    }
};

exports.deleteType = async (req, res) => {
    try {
        await rawmatiriallist.deleteOne({_id: req.params.id})
        res.status(200).send("success");
    } catch (err) {
        res.status(422).send({error: "Error in deleting data"});
    }
}


exports.updateSubType = async (req, res) => {
    try {
        const {type, value} = req.query
        const key = `materialList.${type}.subTypes`
        await rawmatiriallist.updateOne(
            {},
            { $pull: { [key]: { $in: [ value ] } } }
        )
        res.status(200).send({update : true});
    } catch (err) {
        res.status(422).send({error: "Error in updating data"});
    }
}

exports.addSubType = async (req,res) => {
    try{
        console.log(req.body.id);
        await rawmatiriallist.updateOne({
            _id: ObjectId(req.body.id),
            [`materialList.${req.body.subtype}.hasSubTypes`]: true
        }, {$push: {[`materialList.${req.body.subtype}.subTypes`]: `${req.body.subtypevalue}`}});
        res.status(200).send("Success");
    }catch (err) {
        res.status(422).send({error: "Error in adding data"});
    }
};

exports.deleteSubType = async (req,res) => {
    try{

    }catch (err) {
        res.status(422).send({error: "Error in deleting data"});
    }
};
