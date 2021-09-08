const mongoose = require("mongoose");
const rawMaterial = mongoose.model("rawMaterial");

exports.createMaterialData = async (req, res) => {
    try {
        const data = req.body;
        if (!data.typeId) {
            return res.status(500).send({message: "TypeId is missing"});
        }
        const isExistType = await rawMaterial.findOne({typeId: data.typeId.toString()});
        if (isExistType && isExistType._id) {
            await rawMaterial.updateOne({typeId: data.typeId.toString()},
                {
                    $inc: {
                        weight: data && data.weight && data.weight || 0,
                        piece: data && data.piece && data.piece || 0,
                        length: data && data.length && data.length || 0
                    }
                });
            res.status(200).send({update: true})
        } else {
            await rawMaterial.create(req.body);
            res.status(200).send({success: true})
        }
    } catch (err) {
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

exports.deleteRawMaterial = async (req, res) => {
    try {
        await rawMaterial.deleteOne({_id: req.params.id});
        res.status(200).send({success: true});
    } catch (err) {
        res.send(err);
    }
};

exports.deleteRawMaterialData = async (req, res) => {
    try {
        const data = req.body;
        if (!data.typeId) {
            return res.status(500).send({message: "TypeId is missing"});
        }
        await rawMaterial.updateOne({typeId: data.typeId.toString()},
            {
                $inc: {
                    weight: data && data.weight && -data.weight || 0,
                    piece: data && data.piece && -data.piece || 0,
                    length: data && data.length && -data.length || 0
                }
            });
        res.status(200).send({update: true})
    } catch (err) {
        res.status(422).send({error: "Some error occurred while delete stock."});
    }
};
