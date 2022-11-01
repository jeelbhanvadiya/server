const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId
const Services = require('../extraServices/model');
const Stock = require('../stock/model');
const rawMaterial = require('../rawMaterialStockData/model');
const attendance = require('../attendances/model')
const acData = require('../accData/model')

exports.homePage = async (req, res) => {
    try {
        const serviceData = await Services.find({});
        const rawMaterialData = await rawMaterial.find({});
        const attendanceData = await attendance.find({});
        const ac_data = await acData.find({});
        res.status(200).json({ status: 200, message: "Home page successfully!", data: { serviceData, rawMaterialData, attendanceData, ac_data }, error: {} });
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving login." });
    }
};

exports.homePageCount = async (req, res) => {
    try {
        const sellStockData = await Stock.countDocuments({ sell: true });
        const deleteStockData = await Stock.countDocuments({ isDeleted: true });
        const currentStockData = await Stock.countDocuments({ isDeleted: false, sell: false });
        res.status(200).json({ status: 200, message: "Home page count successfully!", data: { sellStockData, deleteStockData, currentStockData }, error: {} });
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving login." });
    }
};