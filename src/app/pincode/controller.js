const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId
const Area = mongoose.model("area");
const Pincode = mongoose.model("pincode");
const Users = mongoose.model("users");
const commanFun = require('../../commanFun/index')

exports.add_pincode = async (req, res) => {
    try {
        let body = req.body
        if (body == {})
            return res.status(400).send({ message: "Request body is empty" })
        let areaIsExist = await Area.findOne({ _id: ObjectId(body?.areaId) })
        if (!areaIsExist)
            return res.status(404).send({ message: "You requested area id not found!" })
        let response = await new Pincode(body).save()
        return res.status(400).send({ message: "Pincode has been successfully added!", data: response })
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving login." });
    }
};

exports.get_pincode = async (req, res) => {
    try {
        let { page, limit, areaId } = req.body

        let [response, count] = await Promise.all([
            Pincode.aggregate([
                { $match: { areaId: ObjectId(areaId) } },
                { $sort: { createdAt: -1 } },
                { $skip: (((page - 1) * limit)) },
                { $limit: limit },
            ]),
            Pincode.countDocuments({ areaId: ObjectId(areaId) })
        ])
        return res.status(400).send({
            message: "Pincode has been successfully added!", pincode_data: response, state: {
                page: page,
                limit: limit,
                page_limit: Math.ceil(count / (req.body?.limit)) || 1,
            }
        })
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving login." });
    }
};