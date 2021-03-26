const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const companySchema = new Schema(
    {
        stockNo: {type: Number, required: false},
        companyName: {type: String, required: false},
        InNo: {type: Number, required: false},
        InDate: {type: String, required: false},
        billNo: {type: Number, required: false},
        billDate: {type: String, required: false},
        Address: {
            houseNo: {type: String, required: false},
            streetName: {type: String, required: false},
            landmark: {type: String, required: false},
            area: {type: String, required: false},
            city: {type: String, required: false},
            state: {type: String, required: false},
            pinCode: {type: Number, required: false},
        }
    }
);

module.exports = mongoose.model("company", companySchema);

