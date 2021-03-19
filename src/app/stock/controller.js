const mongoose = require("mongoose");

const Stock = mongoose.model("stock");

exports.createStock = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Users content can not be empty"
        });
    }
    Stock.create(req.body)
        .then(stock => {
            res.status(200).send({stock, message: "successfully Created stock"});
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the users."
        });
    });
};

exports.getStock = async (req, res) => {
    try {
        const stock = await Stock.find({});
        res.status(200).send(stock);
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while retrieving login."});
    }
};

exports.getSellStock = async (req, res) => {
    let arrray = [];
    try {
        const stock = await Stock.find({});
        stock.forEach(item => {
            if(item.sell === true){
                arrray.push(item)
            }
        })
        res.status(200).send(arrray);
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while retrieving login."});
    }
};

exports.getStockNoWise = async (req, res) => {
    console.log(req.params.stockno)
    try {
        const stock = await Stock.findOne({stockNo: req.params.stockno})
        res.status(200).send(stock);
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while retrieving login."});
    }
};

exports.updateStock = async (req, res) => {
    try {
        if (req.params.id) {
            const editedStock = await Stock.findByIdAndUpdate(req.params.id, req.body);
            if (editedStock && editedStock._id) {
                res.status(200).send({success: true, editedStock});
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

exports.deleteStock = async (req, res) => {
    try {
        await Stock.deleteOne({_id: req.params.id})
        res.status(200).send("success");
    } catch(err) {
        res.status(422).send({error: "Error in getting course details"});
    }
}