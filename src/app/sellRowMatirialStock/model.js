const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sellRawMatirialStockSchema = new Schema(
    {
        typeId: {type: Number, required: true},
        typeName: {type: String, required: true},
        gasType: {type: String, required: false},
        weight: {type: Number, required: false},
        piece: {type: Number, required: false},
        billNo: {type: String, required: false},
        length: {type: Number, required: false},
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("sellRawMatirialStock", sellRawMatirialStockSchema);

