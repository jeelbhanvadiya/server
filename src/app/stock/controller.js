const mongoose = require("mongoose");
const commanFun = require('../../commanFun/index')
const Stock = mongoose.model("stock");
const acData = mongoose.model("acData");

function getNumber(num, targetLength) {
    return num.toString().padStart(targetLength, 0);
}

exports.createStock = async (req, res) => {
    try {
        if (!req.body || req.body.length < 0) {
            return res.status(400).send({
                message: "content can not be empty"
            });
        }
        const accData = await acData.find({});
        const isExistData = await Stock.aggregate([
            {$project: {yearSubstring: {$substr: ["$stockNo", 0, 4]}},},
            {$match: {yearSubstring: accData[0].stockNo.toString()}},
        ]);
        let count = 1;
        if (isExistData && isExistData.length > 0) {
            count = isExistData.length + 1
        }
        (req.body || []).forEach((item, index) => {
            item.stockNo = `${accData[0].stockNo}${getNumber(count + index, 5)}`
        })
        await Stock.insertMany(req.body)
            .then(stock => {
                res.status(200).send({stock, message: "successfully Created stock"});
            }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the users."
            });
        });
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while creating stock."});
    }
};

exports.getStock = async (req, res) => {
    try {
        const stock = await Stock.find({});
        res.status(200).send(stock);
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while retrieving login."});
    }
};


exports.filterBySellData = async (req, res) => {
    try {
        const {sell} = req.body;
        if (!req.body) {
            return res.status(200).send({message: "Please pass the valid data"});
        }
        const stock = await Stock.find(req.body);
        res.status(200).send(stock);
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while retrieving login."});
    }
};

exports.getDataByCapacity = async (req, res) => {
    try {
        let keyName = Object.keys(req.query)[0]
        const stock = await Stock.find({sell: false, [keyName]: Object.values(req.query)[0]});
        res.status(200).send(stock);
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while getting data."});
    }
};

exports.getDataByCapacityTrue = async (req, res) => {
    try {
        let keyName = Object.keys(req.query)[0]
        const stock = await Stock.find({sell: true, [keyName]: Object.values(req.query)[0]});
        res.status(200).send(stock);
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while getting data."});
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

exports.editStock = async (req, res) => {
    try {
        if (req.params.stockNo) {
            const editedStock = await Stock.updateOne({stockNo: req.params.stockNo}, req.body);
            if (editedStock) {
                res.send({success: true, editedStock});
            } else {
                res.send({success: false, message: "stock no is not found"});
            }
        } else {
            res.send({success: false, message: "Please send correct stock info"});
        }
    } catch (err) {
        res.send(err);
    }
};

exports.deleteStock = async (req, res) => {
    try {
        await Stock.deleteOne({_id: req.params.id})
        res.status(200).send("success");
    } catch (err) {
        res.status(422).send({error: "Error in getting course details"});
    }
}

exports.filterStockData = async (req, res) => {
    try {
        const {value, type} = req.body;
        let data = [];
        if (type === "DAY") {
            data = await Stock.find({invoiceDate: commanFun.getFormatDate(value)})
        } else if (type === "MONTH") {
            data = await Stock.aggregate(
                [
                    {
                        $project:
                            {
                                month: {$month: '$invoiceDate'},
                                sell: 1,
                                clientPhoneNo: 1,
                                stockNo: 1,
                                indoorSrNo: 1,
                                outdoorSrNo: 1,
                                weight: 1,
                                unitIndoorNo: 1,
                                unitOutdoorNo: 1,
                                invoiceNo: 1,
                                invoiceDate: 1,
                                companyId: 1,
                                billingAddress: 1,
                            }
                    },
                    {
                        $match: {month: parseInt(value)}
                    }
                ])
        } else if (type === "YEAR") {
            data = await Stock.aggregate(
                [
                    {
                        $project:
                            {
                                year: {$year: '$invoiceDate'},
                                sell: 1,
                                clientPhoneNo: 1,
                                stockNo: 1,
                                indoorSrNo: 1,
                                outdoorSrNo: 1,
                                weight: 1,
                                unitIndoorNo: 1,
                                unitOutdoorNo: 1,
                                invoiceNo: 1,
                                invoiceDate: 1,
                                companyId: 1,
                                billingAddress: 1,
                            }
                    },
                    {
                        $match: {year: parseInt(value)}
                    }
                ])
        } else if (type === "WEEK") {
            data = await Stock.aggregate(
                [
                    {
                        $project:
                            {
                                week: {$week: '$invoiceDate'},
                                sell: 1,
                                clientPhoneNo: 1,
                                stockNo: 1,
                                indoorSrNo: 1,
                                outdoorSrNo: 1,
                                weight: 1,
                                unitIndoorNo: 1,
                                unitOutdoorNo: 1,
                                invoiceNo: 1,
                                invoiceDate: 1,
                                companyId: 1,
                                billingAddress: 1,
                            }
                    }
                ])
        }
        res.status(200).send({success: true, data});
    } catch (err) {
        res.status(422).send({error: "Error in getting course details"});
    }
}