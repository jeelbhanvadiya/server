const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const companySchema = new Schema(
    {
        stockNo: {type: Number, required: true},
        companyName: {type: String, required: true},
        InNo: {type: Number, required: true},
        InDate: {type: String, required: true},
        billNo: {type: Number, required: true},
        billDate: {type: String, required: true},
        Address: {
            houseNo: {type: String, required: true},
            streetName: {type: String, required: true},
            landmark: {type: String, required: true},
            area: {type: String, required: true},
            city: {type: String, required: true},
            state: {type: String, required: true},
            pinCode: {type: Number, required: true},
        }
    }
);

module.exports = mongoose.model("company", companySchema);

