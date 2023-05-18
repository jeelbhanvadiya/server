const mongoose = require("mongoose");
const commanFun = require('../../commanFun/index')
const Stock = mongoose.model("stock");
const sellStock = require('../sellStockData/model');
const { notification_to_user } = require("../../utilities/notification");
const { apiResponse } = require("../../common");
const { responseMessage } = require("../../utilities/responseMessage");
const acData = mongoose.model("acData");
const Services = mongoose.model("services");
const ObjectId = mongoose.Types.ObjectId
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
            { $project: { yearSubstring: { $substr: ["$stockNo", 0, 4] } }, },
            { $match: { yearSubstring: accData[0].stockNo.toString() } },
        ]);
        let count = 1;
        if (isExistData && isExistData.length > 0) {
            count = isExistData.length + 1
        }
        (req.body || []).forEach((item, index) => {
            item.stockNo = `${accData[0].stockNo}${getNumber(count + index, 5)}`
        })
        await Stock.insertMany(req.body)
            .then(async stock => {
                let stockIds = []
                stock.forEach(data => { stockIds.push(data?._id) })
                let notificationData = await notification.add_stock({ stockIds })
                // await notification_to_user({ deviceToken: [], }, notificationData?.data, notificationData?.template)
                res.status(200).send({ stock, message: "successfully Created stock" });
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the users."
                });
            });
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while creating stock." });
    }
};

exports.getStock = async (req, res) => {
    try {
        const stock = await Stock.find({});
        res.status(200).send(stock);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving login." });
    }
};

exports.migration = async (req, res) => {
    try {
        function searchStringInArray(str, strArray) {
            for (var j = 0; j < strArray.length; j++) {
                if (strArray[j].match(str)) return j;
            }
            return -1;
        }

        let { stockIds, stockYear } = req.body
        let stockNo = new RegExp(`^${stockYear}`, "ig"), update_JSON = {}
        for (let i = 0; i < stockIds?.length; i++) {
            let isAlreadyAssign = await Stock.findOne({ _id: ObjectId(stockIds[i]), stockNo: { $regex: stockNo } })
            if (isAlreadyAssign)
                return res.status(200).send({ stockData: {}, message: "You've request stock already exist same year." });
        }
        for (let i = 0; i < stockIds?.length; i++) {
            let [count, stockData] = await Promise.all([
                Stock.countDocuments({ stockNo: { $regex: stockNo } }),
                Stock.findOne({ _id: ObjectId(stockIds[i]), }),
            ])
            if (parseInt(stockData?.stockNo?.substring(0, 4)) < parseInt(stockYear)) {
                update_JSON.oldHistory = [...(stockData?.oldHistory || []), stockData?.stockNo, `${stockYear}${getNumber(count + 1, 5)}`]
                update_JSON.stockNo = `${stockYear}${getNumber(count + 1, 5)}`
            } else {
                let index = searchStringInArray(stockYear, stockData?.oldHistory)
                update_JSON.stockNo = `${stockData?.oldHistory[index]}`
            }
            stockData = await Stock.findOneAndUpdate({ _id: ObjectId(stockIds[i]) }, update_JSON, { new: true })
            if (!stockData)
                return res.status(200).send({ stockData, message: "You've request stock id not found." });
        }
        return res.status(200).send({
            message: "Stock has been successfully migrated"
        })
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving login." });
    }
};

exports.filterBySellData = async (req, res) => {
    try {
        const { sell } = req.body;
        if (!req.body) {
            return res.status(200).send({ message: "Please pass the valid data" });
        }
        const stock = await Stock.find(req.body);
        res.status(200).send(stock);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving login." });
    }
};

exports.stockPaginationAPI = async (req, res) => {
    try {
        let { page, limit, isSell, isDeleted, isAscending, searchingWord, searchKey, year } = req.body
        let match = { sell: false, isDeleted: false }, sort = { _id: 1 }, skip = ((parseInt(page) - 1) * parseInt(limit)),
            searchingKey = ['stockNo', 'weight', 'indoorSrNo', 'outdoorSrNo', 'unitIndoorNo', 'unitOutdoorNo']
        limit = parseInt(limit)
        if (searchingKey.indexOf(searchKey) == -1 && searchKey)
            return res.status(400).json({ status: 400, message: "Invalid search key", validKeys: searchingKey })
        if (isSell)
            match.sell = isSell
        if (isDeleted) {
            match.isDeleted = isDeleted
            delete match.sell
        }
        if (year) {
            match.stockNo = { $regex: new RegExp(`^${year}`, "ig"), }

        }
        if (searchingWord != "" && searchingWord) {
            let searchArray = []
            searchingWord = searchingWord.split(" ")
            await searchingWord.forEach(data => {
                searchArray.push({ [`${searchKey}`]: { $regex: data, $options: 'si' } })
            })
            match.$or = [{ $and: searchArray }];
        }
        if (isAscending) {
            sort = { _id: -1 }
        }
        let [response, count] = await Promise.all([
            Stock.aggregate([
                { $match: match },
                { $sort: sort },
                { $skip: skip },
                { $limit: limit },
            ]),
            Stock.countDocuments(match)
        ])
        res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('stock'), {
            stock_data: response,
            state: {
                page,
                limit,
                page_limit: Math.ceil(count / limit), data_count: count
            }
        }, {}));
    } catch (err) {
        console.log(err);
        res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, {}));
    }
};

exports.getDataByCapacity = async (req, res) => {
    try {
        let keyName = Object.keys(req.query)[0]
        const stock = await Stock.find({ sell: false, [keyName]: Object.values(req.query)[0] });
        res.status(200).send(stock);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while getting data." });
    }
};

exports.getDataByCapacityTrue = async (req, res) => {
    try {
        let keyName = Object.keys(req.query)[0]
        const stock = await Stock.find({ sell: true, [keyName]: Object.values(req.query)[0] });
        res.status(200).send(stock);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while getting data." });
    }
};

exports.getStockNoWise = async (req, res) => {
    try {
        const stock = await Stock.findOne({ stockNo: req.params.stockno })
        res.status(200).send(stock);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving login." });
    }
};

exports.updateStock = async (req, res) => {
    try {
        let editedStock
        if (req.params.id) {
            if (req.body?.isDeleted == false && req.body.sell == false) {
                req.body.crmStatus = false
                editedStock = await Stock.findByIdAndUpdate(req.params.id, req.body);
                await sellStock.deleteMany({ stock: { $elemMatch: { stockNo: editedStock?.stockNo, } } })
                await Services.deleteMany({ stockNo: editedStock?.stockNo })
            } else {
                editedStock = await Stock.findByIdAndUpdate(req.params.id, req.body);
            }
            if (editedStock && editedStock._id) {
                res.status(200).send({ success: true, editedStock });
            } else {
                res.status(401).send({ success: false, message: "user is not found" });
            }
        } else {
            res.status(404).send({ success: false, message: "Please send correct user info" });
        }
    } catch (err) {
        res.send(err);
    }
};

exports.editStock = async (req, res) => {
    try {
        if (req.params.stockNo) {
            const editedStock = await Stock.updateOne({ stockNo: req.params.stockNo }, req.body);
            if (editedStock) {
                res.send({ success: true, editedStock });
            } else {
                res.send({ success: false, message: "stock no is not found" });
            }
        } else {
            res.send({ success: false, message: "Please send correct stock info" });
        }
    } catch (err) {
        res.send(err);
    }
};

exports.deleteStock = async (req, res) => {
    try {
        await Stock.deleteOne({ _id: req.params.id })
        res.status(200).send("success");
    } catch (err) {
        res.status(422).send({ error: "Error in getting course details" });
    }
}

exports.filterStockData = async (req, res) => {
    try {
        const { value, type } = req.body;
        let data = [];
        if (type === "DAY") {
            data = await Stock.find({ invoiceDate: commanFun.getFormatDate(value) })
        } else if (type === "MONTH") {
            data = await Stock.aggregate(
                [
                    {
                        $project:
                        {
                            month: { $month: '$invoiceDate' },
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
                        $match: { month: parseInt(value) }
                    }
                ])
        } else if (type === "YEAR") {
            data = await Stock.aggregate(
                [
                    {
                        $project:
                        {
                            year: { $year: '$invoiceDate' },
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
                        $match: { year: parseInt(value) }
                    }
                ])
        } else if (type === "WEEK") {
            data = await Stock.aggregate(
                [
                    {
                        $project:
                        {
                            week: { $week: '$invoiceDate' },
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
        res.status(200).send({ success: true, data });
    } catch (err) {
        res.status(422).send({ error: "Error in getting course details" });
    }
}

exports.getLastStock = async (req, res) => {
    try {
        let { year, limit, page } = req.body
        let match = {}, sort = { _id: 1 }, skip = ((parseInt(page) - 1) * parseInt(limit))
        limit = parseInt(limit)
        if (year) {
            match.stockNo = { $regex: new RegExp(`^${year}`, "ig"), }

        }
        sort = { stockNo: -1 }
        let [response] = await Promise.all([
            Stock.aggregate([
                { $match: match },
                { $sort: sort },
                { $skip: skip },
                { $limit: limit },
            ]),
        ])
        res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('stock'), {
            stock_data: response,
        }, {}));
    } catch (err) {
        console.log(err);
        res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, {}));
    }
};