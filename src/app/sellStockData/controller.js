const mongoose = require("mongoose");

const sellStock = mongoose.model("sellStock");

function getNumber(num, targetLength) {
    return num.toString().padStart(targetLength, 0);
}

exports.createSellStock = async (req, res) => {
    const year = new Date().getFullYear().toString().substr(-2)
    const data = await sellStock.aggregate([{$count: "sellStock"}]);
    let count = 1;
    if (data && data.length > 0 && data[0].sellStock) {
        count = data[0].sellStock + 1
    }
    req.body.stock.forEach(stock => {
        stock.billNo = `JKR/${(parseInt(year) - 1) + "-" + parseInt(year)}/GST${getNumber(count, 5)}`
    });
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
        let query = {}
        if(req.body.query){
            query = req.body.query
            // query = {clientName: 'bhautik'}
            // query = {clientComapnyName: 'joy'}
            // query = {clientPhoneNo: 73895466234}
            // query = { 'stock.GSTNo': "222"}
        }
        const SellStock = await sellStock.find(query);
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
    } catch (err) {
        res.status(422).send({error: "Error in getting course details"});
    }
}