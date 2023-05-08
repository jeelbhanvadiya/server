const mongoose = require("mongoose");
const { responseMessage } = require("../../utilities/responseMessage");
const { apiResponse } = require("../../common");
const sellRawMatirialStock = mongoose.model("sellRawMatirialStock");
const rawMaterial = mongoose.model("rawMaterial");

exports.createData = async (req, res) => {
    try {
        const data = req.body;
        const create = await sellRawMatirialStock.create(req.body);
        await rawMaterial.updateOne({ typeId: data.typeId.toString() },
            {
                $inc: {
                    weight: data && data.weight && -data.weight || 0,
                    piece: data && data.piece && -data.piece || 0,
                    length: data && data.length && -data.length || 0
                }
            });
        res.status(200).send(create)
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while creating data." });
    }
};

exports.getSellRawMatirialStock = async (req, res) => {
    try {
        let query = {};
        const data = await sellRawMatirialStock.find(query);
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while finding data." });
    }
};

exports.countSellRawMaterialStock = async (req, res) => {
    try {
        let query = {};
        const data = await sellRawMatirialStock.countDocuments(query);
        res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('sell raw material'), data, {}));
    } catch (err) {
        res.status(500).json(new apiResponse(500, responseMessage?.internalServerError, {}, {}));
    }
};

exports.sellRawMaterialPaginationAPI = async (req, res) => {
    try {
        let { page, limit, } = req.body
        let match = {}, sort = { _id: -1 }, skip = ((parseInt(page) - 1) * parseInt(limit))
        limit = parseInt(limit)

        let [response, count] = await Promise.all([
            sellRawMatirialStock.aggregate([
                { $match: match },
                { $sort: sort },
                { $skip: skip },
                { $limit: limit },
            ]),
            sellRawMatirialStock.countDocuments(match)
        ])
        res.status(200).json(new apiResponse(200, responseMessage?.getDataSuccess('sell raw material'), {
            sell_raw_material_data: response,
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

exports.updateData = async (req, res) => {
    try {
        const update = await sellRawMatirialStock.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send({ success: true, update });
    } catch (err) {
        res.send(err);
    }
};

exports.deleteData = async (req, res) => {
    try {
        await sellRawMatirialStock.deleteOne({ _id: req.params.id });
        res.status(200).send("success");
    } catch (err) {
        res.status(422).send({ error: "Some error occurred while delete stock." });
    }
};