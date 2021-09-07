const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sellRawMatirialStockSchema = new Schema(
    {
        typeId: {type: String, required: true},
        customerName: {type: String ,required: false},
        contactNo: {type: Number, required: false},
        typeName: {type: String, required: true},
        gasType: {type: String, required: false, default: null},
        weight: {type: Number, required: false, default: 0},
        piece: {type: Number, required: false, default: 0},
        billNo: {type: String, required: false, default: 0},
        length: {type: Number, required: false, default: 0},
        address: {
            houseNo: {type: String, required: false},
            streetName: {type: String, required: false},
            landmark: {type: String, required: false},
            area: {type: String, required: false},
            city: {type: String, required: false},
            state: {type: String, required: false},
            pinCode: {type: Number, required: false},
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("sellRawMatirialStock", sellRawMatirialStockSchema);

