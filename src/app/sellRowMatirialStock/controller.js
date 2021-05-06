const mongoose = require("mongoose");
const sellRawMatirialStock = mongoose.model("sellRawMatirialStock");
const remainingRawMaterial = mongoose.model("remainingRawMaterial");

exports.createData = async (req, res) => {
    try {
        const create = await sellRawMatirialStock.create(req.body);
        const update = await remainingRawMaterial.updateOne({typeId: req.body.typeId.toString()},
            {$inc: {weight: -req.body.weight,piece : -req.body.piece,length: -req.body.length}});
        res.status(200).send(create)
    }catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while creating data."});
    }
};

exports.getSellRawMatirialStock = async (req, res) => {
    try {
        let query = {};
        const data = await sellRawMatirialStock.find(query);
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while finding data."});
    }
};

exports.updateData = async (req, res) => {
    try {
        const update = await sellRawMatirialStock.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send({success: true, update});
    } catch (err) {
        res.send(err);
    }
};

exports.deleteData = async (req, res) => {
    try {
        await sellRawMatirialStock.deleteOne({_id: req.params.id});
        res.status(200).send("success");
    } catch (err) {
        res.status(422).send({error: "Some error occurred while delete stock."});
    }
};