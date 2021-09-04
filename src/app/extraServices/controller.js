const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId
const Services = mongoose.model("extraservices");
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
        const isPhoneNumber = await Services.findOne({phoneNumber: req.body.phoneNumber});
            if (!isPhoneNumber) {
                Services.create(req.body)
                    .then(SellStock => {
                        res.status(200).send({SellStock, message: "successfully Created services"});
                    }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the company."
                    });
                })
            } else {
                    if(isPhoneNumber.services[isPhoneNumber.services.length - 1].serviceCompleteStatus === true){
                        isPhoneNumber.services.push(req.body.services[0]);
                        await Services.findOneAndUpdate({phoneNumber: req.body.phoneNumber}, isPhoneNumber).then(data => {
                            res.status(200).send({updateList: data , message: "successfully updated services"});
                        });
                    }else {
                        res.status(200).send({message: "Please Complete first Pending Service"});
                    }
            }
        }  catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while creating services."});
    }
};

exports.getServiceData = async (req, res) => {
    try {
        const SellStock = await Services.find({});
        res.status(200).send(SellStock);
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while retrieving login."});
    }
};

exports.getServicesStockNo = async (req, res) => {
    try {
        const SellStock = await Services.findOne({phoneNumber: req.params.id});
        res.status(200).send(SellStock.services);
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while retrieving login."});
    }
};

exports.updateService = async (req, res) => {
    try {
        const list = await Services.findOne({phoneNumber: req.body.phoneNumber});
        if (list) {
                list.services.map(item => {
                if (item.serviceCompleteStatus === false) {
                    item.serviceCompleteStatus = true
                }
            });
            list.services[list.services.length - 1].signatureImgUrl = req.body.services[0].signatureImgUrl;
            list.services[list.services.length - 1].serviceRating = req.body.services[0].serviceRating;
            list.services[list.services.length - 1].serviceBoyRating = req.body.services[0].serviceBoyRating;
            list.services[list.services.length - 1].completeDate = req.body.services[0].completeDate;
            list.services[list.services.length - 1].address = req.body.services[0].address;
            await Services.findOneAndUpdate({phoneNumber: req.body.phoneNumber}, list).then(data => {
                res.status(200).send({updateList: data, message: "successfully updated services"});
            });
        }else {
            res.status(200).send({ message: "stock not found services"});
        }
    } catch (err) {
        res.status(404).send({success: false, message: "Please send correct info"});
    }
};

exports.deleteByServiceId = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({
                message: "please pass phoneNumber and service id, it can not be empty"
            });
        }
        const isPhoneNumber = await Services.findOne({phoneNumber: req.body.phoneNumber});
        const data = isPhoneNumber;
        if(isPhoneNumber) {
            const length = data.services.length;
            await data.services.splice(-1,1);
            if(length === 1) {
                await Services.deleteOne({phoneNumber: req.body.phoneNumber});
                res.status(200).send({ message: "successfully deleted service cluster"});
            } else{
                const list = await Services.findOneAndUpdate({phoneNumber: req.body.phoneNumber}, data )
                res.status(200).send({serviceList: list , message: "successfully deleted services"});
            }
        }
    } catch (err) {
        res.status(422).send({error: "Error in getting deleting service details"});
    }
}

exports.deleteService = async (req, res) => {
    try {
        await Services.deleteOne({_id: req.params.id});
        res.status(200).send("success");
    } catch (err) {
        res.status(422).send({error: "Error in getting course details"});
    }
}

exports.uploadSignImage = async (req, res) => {
    try {
        const pathName = 'signImages/' + req.file.originalname;
        if (pathName) {
            await Services.updateOne({
                phoneNumber: req.body.phoneNumber,
                "services.serviceCompleteStatus": true
            }, {$set: {"services.$.signatureImgUrl": pathName}})
            res.success(pathName);
        } else {
            res.success({success: "failed", message: "something went wrong"});
        }
    } catch (err) {
        res.send(err);
    }
};

exports.filterData = async (req, res) => {
    try {
        const {value, type} = req.body;
        let data = [];
        if (type === "DAY") {
            data = await Services.find({serviceDate: commanFun.getFormatDate(value), serviceCompleteStatus: false})
        } else if (type === "MONTH") {
            data = await Services.aggregate(
                [
                    {
                        $project:
                            {
                                month: {$month: '$serviceDate'},
                                phoneNumber: 1,
                                serviceDate: 1,
                                serviceManId: 1,
                                serviceCompleteStatus: 1,
                                Feedback: 1,
                                signatureImgUrl: 1
                            }
                    },
                    {
                        $match: {month: parseInt(value), serviceCompleteStatus: false}
                    }
                ])
        } else if (type === "YEAR") {
            data = await Services.aggregate(
                [
                    {
                        $project:
                            {
                                year: {$year: '$serviceDate'},
                                phoneNumber: 1,
                                serviceDate: 1,
                                serviceManId: 1,
                                serviceCompleteStatus: 1,
                                Feedback: 1,
                                signatureImgUrl: 1
                            }
                    },
                    {
                        $match: {year: parseInt(value), serviceCompleteStatus: false}
                    }
                ])
        } else if (type === "WEEK") {
            data = await Services.aggregate(
                [
                    {
                        $project:
                            {
                                week: {$week: '$serviceDate'},
                                phoneNumber: 1,
                                serviceDate: 1,
                                serviceManId: 1,
                                serviceCompleteStatus: 1,
                                Feedback: 1,
                                signatureImgUrl: 1
                            }
                    },
                    {
                        $match: {serviceCompleteStatus: false}
                    }
                ])
        }
        res.status(200).send({success: true, data});
    } catch (err) {
        res.status(422).send({error: "Error in getting course details"});
    }
}

exports.serviceMainIdUpdate = async (req, res) => {
    try {
        await Services.updateOne({
            phoneNumber: req.body.phoneNumber,
            "services._id": ObjectId(req.body.serviceId)
        }, {$set: {"services.$.serviceManId": ObjectId(req.body.serviceMainId)}})
        res.status(200).send({success : true});
    }catch (e) {
        res.status(422).send({error: "Error in Updating ServiceMain Id"});
    }
}
