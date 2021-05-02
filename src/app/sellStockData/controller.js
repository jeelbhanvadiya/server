const mongoose = require("mongoose");

const sellStock = mongoose.model("sellStock");
const stockModal = mongoose.model("stock");

function getNumber(num, targetLength) {
    return num.toString().padStart(targetLength, 0);
}

function getCurrentYear() {
    return new Date().getFullYear().toString().substr(-2)
}

exports.createSellStock = async (req, res) => {
    try {
        const {clientPhoneNo, stock} = req.body;
        const year = getCurrentYear();
        const data = await sellStock.aggregate([{$count: "sellStock"}]);
        let count = 1;
        if (data && data.length > 0 && data[0].sellStock) {
            count = data[0].sellStock + 1
        }
        stock.forEach(stock => {
            stock.billNo = `JKR/${(parseInt(year) - 1) + "-" + parseInt(year)}/GST${getNumber(count, 5)}`
        });
        const isExist = await sellStock.findOne({clientPhoneNo: clientPhoneNo})
        if (isExist && isExist._id) {
            const update = await sellStock.updateOne({clientPhoneNo: clientPhoneNo}, {
                $push: {
                    stock: {
                        $each: stock,
                        $position: -2
                    }
                }
            });
            if (update && update.ok) {
                res.status(200).send({updated: true, message: "successfully updated"});
            } else {
                res.status(200).send({updated: false, message: "something went wrong"});
            }
        } else {
            const create = await sellStock.create(req.body)
            if (create && create._id) {
                const promiseBuilder = {
                    updateAppPromise: (payload) => {
                        return new Promise(async (resolve) => {
                            const update = await stockModal.updateOne({stockNo: payload.stockNo}, {
                                sell: true,
                                clientPhoneNo: clientPhoneNo
                            });
                            if (update && update.ok) {
                                return resolve({success: true});
                            } else {
                                return resolve({success: false});
                            }
                        });
                    }
                };
                const allPromises = [];
                stock.forEach((item) => {
                    allPromises.push(promiseBuilder.updateAppPromise(item));
                });
                await Promise.all(allPromises).then(values => {
                    if (values.some(value => value.success)) {
                        res.status(200).send(create)
                    } else {
                        res.status(500).send({success: false, message: "something went wrong"})
                    }
                });
            } else {
                res.status(200).send({success: false, message: 'something went wrong'})
            }

        }
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while creating sell -stock."});
    }
};

exports.getSellStock = async (req, res) => {
    try {
        let query = {}
        if (req.body.query) {
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

exports.getSellStockStockNo = async (req, res) => {
    try {
        const data = await sellStock.find({});
        let datalist = {};
        data.map(item => {
            datalist = item.stock.find(prod => Number(prod.stockNo) === Number(req.params.stockno))
        });
        if (datalist) {
            res.status(200).send(datalist);
        } else {
            res.status(200).send("Not Found any data");
        }
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while retrieving login."});
    }
};


exports.searchingSellStock = async (req, res) => {
    try {
        let stockData
        let stockSearchList = ["GSTNo", "unitIndoorNo", "unitOutdoorNo", "stockNo"];
        let keyName = Object.keys(req.query)[0]
        if (stockSearchList.includes(Object.keys(req.query)[0])) {
            keyName = "stock.".concat(Object.keys(req.query)[0].toString())
        }
        if (req.query.clientPhoneNo) {
            stockData = await sellStock.find({clientPhoneNo: Number(req.query.clientPhoneNo)})
        } else if (req.query.stockNo) {
            stockData = await sellStock.aggregate([
                {
                    $addFields: {stocks: {$map: {input: "$stock", in: {stockNo: {$toString: '$$this.stockNo'}}}}}
                },
                {$unwind: '$stocks'},
                {$match: {'stocks.stockNo': new RegExp(req.query.stockNo)}},
                {$group: {_id: 1, stocks: {$push: '$stocks'}}},
                {$project: {stocks: 1, _id: 0}}
            ])
        } else {
            stockData = await sellStock.find({[`${keyName}`]: {$regex: Object.values(req.query)[0], $options: 'i'}})
        }
        res.status(200).send(stockData)
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while retrieving login."});
    }
};


exports.updateSellStock = async (req, res) => {
    try {
        if (req.params.stockno) {
            const editedCompany = await sellStock.updateOne({"stock.stockNo": req.params.stockno}, {
                $set: {
                    "stock.$.CrmNo": req.body.CrmNo,
                    'stock.$.CustomerNo': req.body.CustomerNo,
                    'Date': req.body.Date
                }
            });
            if (editedCompany && editedCompany.ok) {
                res.status(200).send({updated: true});
            } else {
                res.status(200).send({updated: false, message: "something went wrong"});
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