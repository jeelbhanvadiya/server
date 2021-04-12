const mongoose = require("mongoose");
const remainingRawMaterial = mongoose.model("remainingRawMaterial");

exports.createData = async (req, res) => {
    try {
        const create = await remainingRawMaterial.create(req.body);
        res.status(200).send(create)
    }catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while creating data."});
    }
};

exports.getRemainingRawMaterialData = async (req, res) => {
    try {
        let query = {};
        const data = await remainingRawMaterial.find(query);
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while finding data."});
    }
};

exports.updateData = async (req, res) => {
    try {
        const update = await remainingRawMaterial.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send({success: true, update});
    } catch (err) {
        res.send(err);
    }
};

exports.deleteData = async (req, res) => {
    try {
        await remainingRawMaterial.deleteOne({_id: req.params.id});
        res.status(200).send("success");
    } catch (err) {
        res.status(422).send({error: "Some error occurred while delete stock."});
    }
};