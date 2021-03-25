const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId
const Services = mongoose.model("services");
const Users = mongoose.model("users");

exports.createServices = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Users content can not be empty"
        });
    }
    const isExist = await Users.findOne({firstName: req.body.name})
    if (isExist && isExist._id) {
        req.body.serviceManId = isExist._id;
        Services.create(req.body)
            .then(SellStock => {
                res.status(200).send({SellStock, message: "successfully Created services"});
            }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the company."
            });
        });
    } else {
        res.status(200).send({
            message: "service man is not found"
        });
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

exports.updateService = async (req, res) => {
    try {
        console.log(req.params.id)
        if (req.params.id) {
            const editedCompany = await Services.findByIdAndUpdate(req.params.id, req.body);
            if (editedCompany && editedCompany._id) {
                res.status(200).send({success: true, editedCompany});
            } else {
                res.status(401).send({success: false, message: "user is not found"});
            }
        } else {
            res.status(404).send({success: false, message: "Please send correct user info"});
        }
    } catch (err) {
        res.send(err);
    }
};

exports.deleteService = async (req, res) => {
    try {
        await Services.deleteOne({_id: req.params.id})
        res.status(200).send("success");
    } catch(err) {
        res.status(422).send({error: "Error in getting course details"});
    }
}

exports.uploadSignImage = async (req, res) => {
    try {
        const pathName = 'signImages/' + req.file.originalname;
        if (pathName) {
            const editedCompany = await Services.updateOne({_id: ObjectId(req.params.id)}, {$set: {signatureImgUrl: pathName}});
            res.success(editedCompany);
        } else {
            res.success({success: "failed", message: "something went wrong"});
        }
    } catch (err) {
        res.send(err);
    }
};
