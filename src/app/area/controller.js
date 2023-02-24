const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId
const Area = mongoose.model("area");
const Users = mongoose.model("users");
const commanFun = require('../../commanFun/index')

exports.add_area = async (req, res) => {
    try {
        let body = req.body
        if (body == {})
            return res.status(400).send({ message: "Request body is empty" })
        let response = await new Area(body).save()
        return res.status(400).send({ message: "Area has been successfully added!", data: response })
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving login." });
    }
};

exports.get_area = async (req, res) => {
    try {
        let { page, limit, searchName } = req.body, match = {}

        if (searchName && searchName != "") {
            let nameArray = []
            searchName = searchName.split(" ")
            await searchName.forEach(data => {
                nameArray.push({ "name": { $regex: data, $options: 'si' } })
            })
            match.$or = [{ $and: nameArray }];
        };
        let [response, count] = await Promise.all([
            Area.aggregate([
                { $match: match },
                { $sort: { createdAt: -1 } },
                { $skip: (((page - 1) * limit)) },
                { $limit: limit },
            ]),
            Area.countDocuments(match)
        ])
        return res.status(400).send({
            message: "Area has been successfully retrieved!", area_data: response, state: {
                page: page,
                limit: limit,
                page_limit: Math.ceil(count / (req.body?.limit)) || 1,
            }
        })
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving login." });
    }
};