const mongoose = require("mongoose");
const rawMaterial = mongoose.model("rawMaterial");
const remainingRawMaterial = mongoose.model("remainingRawMaterial");

exports.createMaterialData = async (req, res) => {
    try {
        const create = await rawMaterial.create(req.body);
        if (create && create._id) {
            const isExist = await remainingRawMaterial.findOne({typeId: req.body.typeId})
            if (isExist && isExist._id) {
                const update = await remainingRawMaterial.updateOne({typeId: req.body.typeId},
                    {$inc: {weight: req.body.weight,piece : req.body.piece,length:req.body.length}});
                if (update && update.ok) {
                    res.status(200).send({success: true})
                }
            } else {
                await remainingRawMaterial.create(req.body);
                res.status(200).send({success: true})
            }
        } else {
            res.status(500).send({success: false, message: "Something went wrong"});
        }
    }catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while finding data."});
    }
};

exports.getRawMaterialData = async (req, res) => {
    try {
        const data = await rawMaterial.find({});
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while finding data."});
    }
};

exports.updateRawMaterialData = async (req, res) => {
    try {
        const update = await rawMaterial.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send({success: true, update});
    } catch (err) {
        res.send(err);
    }
};

exports.deleteRawMaterialData = async (req, res) => {
    try {
        await rawMaterial.deleteOne({_id: req.params.id});
        res.status(200).send("success");
    } catch (err) {
        res.status(422).send({error: "Some error occurred while delete stock."});
    }
};