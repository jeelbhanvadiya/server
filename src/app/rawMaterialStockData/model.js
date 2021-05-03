const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const rawMaterialStockSchema = new Schema(
    {
        typeId: {type: String, required: true},
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

module.exports = mongoose.model("rawMaterial", rawMaterialStockSchema);

