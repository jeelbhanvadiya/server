const mongoose = require("mongoose");
const rawMaterial = mongoose.model("rawMaterial");

exports.createSellStock = async (req, res) => {
    const create = await rawMaterial.create(req.body);
    res.status(200).send(create)
};

exports.getSellStock = async (req, res) => {
    try {
        let query = {};
        const rawMaterial = await rawMaterial.find(query);
        res.status(200).send(rawMaterial);
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while finding data."});
    }
};

exports.updateSellStock = async (req, res) => {
    try {
        const update = await rawMaterial.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send({success: true, update});
    } catch (err) {
        res.send(err);
    }
};

exports.deleteSellStock = async (req, res) => {
    try {
        await rawMaterial.deleteOne({_id: req.params.id});
        res.status(200).send("success");
    } catch (err) {
        res.status(422).send({error: "Some error occurred while delete stock."});
    }
};