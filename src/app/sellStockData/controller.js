const mongoose = require("mongoose");

const sellStock = mongoose.model("sellStock");

exports.createSellStock = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Users content can not be empty"
        });
    }
    sellStock.create(req.body)
        .then(SellStock => {
            res.status(200).send({SellStock, message: "successfully Created SellSrock"});
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the company."
        });
    });
};

exports.getSellStock = async (req, res) => {
    try {
        const SellStock = await sellStock.find({});
        res.status(200).send(SellStock);
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while retrieving login."});
    }
};

exports.updateSellStock = async (req, res) => {
    try {
        console.log(req.params.id)
        if (req.params.id) {
            const editedCompany = await sellStock.findByIdAndUpdate(req.params.id, req.body);
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

exports.deleteSellStock = async (req, res) => {
    try {
        await sellStock.deleteOne({_id: req.params.id})
        res.status(200).send("success");
    } catch(err) {
        res.status(422).send({error: "Error in getting course details"});
    }
}