const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId
const Services = mongoose.model("services");
const Users = mongoose.model("users");
const commanFun = require('../../commanFun/index')

exports.createServices = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({
                message: "Users content can not be empty"
            });
        }
        // const isExist = await Users.findOne({firstName: req.body.name})
        const isStockNO = await Services.findOne({ stockNo: req.body.stockNo });
        if (!isStockNO) {
            Services.create(req.body)
                .then(SellStock => {
                    res.status(200).send({ SellStock, message: "successfully Created services" });
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the company."
                    });
                })
        } else {
            if (isStockNO.services[isStockNO.services.length - 1].serviceCompleteStatus === true) {
                isStockNO.services.push(req.body.services[0]);
                await Services.findOneAndUpdate({ stockNo: req.body.stockNo }, isStockNO).then(data => {
                    res.status(200).send({ updateList: data, message: "successfully updated services" });
                });
            } else {
                res.status(200).send({ message: "Please Complete first Pending Service" });
            }
        }
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while creating services." });
    }
};

exports.getServiceData = async (req, res) => {
    try {
        const SellStock = await Services.find({});
        res.status(200).send(SellStock);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving login." });
    }
};

exports.getServicesStockNo = async (req, res) => {
    try {
        const SellStock = await Services.aggregate([
            { $match: { stockNo: parseInt(req.params.id) } },
            {
                $unwind: {
                    path: "$services",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    let: { userId: '$services.serviceManId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$_id', '$$userId'] },
                                    ],
                                },
                            }
                        },
                        { $project: { firstName: 1, middleName: 1, lastName: 1, gender: 1, email: 1, } }
                    ],
                    as: "user"
                }
            },
            {
                $addFields: {
                    "services.salesman": "$user"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    stockNo: { $first: "$stockNo" },
                    serviceDate: { $first: "$serviceDate" },
                    services: { $addToSet: "$services" },
                }
            }
        ]);
        res.status(200).send(SellStock[0]?.services || []);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message || "Some error occurred while retrieving login." });
    }
};

exports.updateService = async (req, res) => {
    try {
        const data = req.body;
        const { services } = data;
        if (!services || services && !services.length) {
            return res.status(404).send({ success: false, message: "services data is missing" });
        }
        const isUpdate = await Services.updateOne({ stockNo: data.stockNo }, {
            $set: {
                "serviceDate": data.serviceDate,
                'services.0.serviceCompleteStatus': services[0].serviceCompleteStatus,
                'services.0.completeDate': services[0].completeDate,
                'services.0.serviceBoyRating': services[0].serviceBoyRating,
                'services.0.Feedback': services[0].Feedback,
                'services.0.signatureImgUrl': services[0].signatureImgUrl,
                'services.0.serviceRating': services[0].serviceRating,
            }
        });
        if (isUpdate && isUpdate.ok) {
            return res.status(200).send({ update: true });
        }
        res.status(200).send({ update: false, message: "Something went wrong" });
    } catch (err) {
        res.status(404).send({ success: false, message: err || "Something went wrong" });
    }
};

exports.updateServiceFullDetails = async (req, res) => {
    try {
        const body = req.body;
        const { serviceId } = body;
        const isUpdate = await Services.updateOne({ _id: ObjectId(serviceId) }, body);
        if (isUpdate && isUpdate.ok) {
            return res.status(200).send({ update: true });
        }
        res.status(200).send({ update: false, message: "Something went wrong" });
    } catch (err) {
        res.status(404).send({ success: false, message: err || "Something went wrong" });
    }
};

exports.deleteByServiceId = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({
                message: "please pass stockno and service id, it can not be empty"
            });
        }
        const isStockNO = await Services.findOne({ stockNo: req.body.stockNo });
        const data = isStockNO;
        if (isStockNO) {
            const length = data.services.length;
            await data.services.splice(-1, 1);
            if (length === 1) {
                await Services.deleteOne({ stockNo: req.body.stockNo });
                res.status(200).send({ message: "successfully deleted service cluster" });
            } else {
                const list = await Services.findOneAndUpdate({ stockNo: req.body.stockNo }, data)
                res.status(200).send({ serviceList: list, message: "successfully deleted services" });
            }
        }
    } catch (err) {
        res.status(422).send({ error: "Error in getting deleting service details" });
    }
}

exports.deleteService = async (req, res) => {
    try {
        await Services.deleteOne({ _id: req.params.id });
        res.status(200).send("success");
    } catch (err) {
        res.status(422).send({ error: "Error in getting course details" });
    }
}

exports.uploadSignImage = async (req, res) => {
    try {
        const pathName = 'signImages/' + req.file.originalname;
        if (pathName) {
            await Services.updateOne({
                stockNo: req.body.stockNo,
                "services.serviceCompleteStatus": true
            }, { $set: { "services.$.signatureImgUrl": pathName } })
            res.success(pathName);
        } else {
            res.success({ success: "failed", message: "something went wrong" });
        }
    } catch (err) {
        res.send(err);
    }
};

exports.filterData = async (req, res) => {
    try {
        const { value, type } = req.body;
        let data = [];
        if (type === "DAY") {
            data = await Services.find({ serviceDate: commanFun.getFormatDate(value), serviceCompleteStatus: false })
        } else if (type === "MONTH") {
            data = await Services.aggregate(
                [
                    {
                        $project:
                        {
                            month: { $month: '$serviceDate' },
                            stockNo: 1,
                            serviceDate: 1,
                            serviceManId: 1,
                            serviceCompleteStatus: 1,
                            Feedback: 1,
                            signatureImgUrl: 1
                        }
                    },
                    {
                        $match: { month: parseInt(value), serviceCompleteStatus: false }
                    }
                ])
        } else if (type === "YEAR") {
            data = await Services.aggregate(
                [
                    {
                        $project:
                        {
                            year: { $year: '$serviceDate' },
                            stockNo: 1,
                            serviceDate: 1,
                            serviceManId: 1,
                            serviceCompleteStatus: 1,
                            Feedback: 1,
                            signatureImgUrl: 1
                        }
                    },
                    {
                        $match: { year: parseInt(value), serviceCompleteStatus: false }
                    }
                ])
        } else if (type === "WEEK") {
            data = await Services.aggregate(
                [
                    {
                        $project:
                        {
                            week: { $week: '$serviceDate' },
                            stockNo: 1,
                            serviceDate: 1,
                            serviceManId: 1,
                            serviceCompleteStatus: 1,
                            Feedback: 1,
                            signatureImgUrl: 1
                        }
                    },
                    {
                        $match: { serviceCompleteStatus: false }
                    }
                ])
        }
        res.status(200).send({ success: true, data });
    } catch (err) {
        res.status(422).send({ error: "Error in getting course details" });
    }
}

exports.serviceMainIdUpdate = async (req, res) => {
    try {
        await Services.updateOne({
            stockNo: req.body.stockNo,
            "services._id": ObjectId(req.body.serviceId)
        }, { $set: { "services.$.serviceManId": ObjectId(req.body.serviceMainId) } });
        res.status(200).send({ success: true });
    } catch (e) {
        res.status(422).send({ error: "Error in Updating ServiceMain Id" });
    }
};