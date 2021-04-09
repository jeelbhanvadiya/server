const mongoose = require("mongoose");

const acData = mongoose.model("acData");

exports.creatAcData = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({
                message: "Users content can not be empty"
            });
        }
        acData.create(req.body)
            .then(data => {
                res.status(200).send({data, message: "successfully Created AC Data"});
            }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the AC Data."
            });
        });
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while create AC Data."});
    }
};

exports.getAcData = async (req, res) => {
    try {
        const data = await acData.find({});
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while retrieving login."});
    }
};

exports.updateAcData = async (req, res) => {
    try {
        if (req.params.id) {
            const editedAcData = await acData.findByIdAndUpdate(req.params.id, req.body);
            if (editedAcData && editedAcData.id) {
                res.status(200).send({success: true, editedAcData});
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

exports.deleteAcData = async (req, res) => {
    try {
        await acData.deleteOne({_id: req.params.id})
        res.status(200).send("success");
    } catch(err) {
        res.status(422).send({error: "Error in getting course details"});
    }
}