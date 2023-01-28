const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const rawMaterialStockSchema = new Schema(
    {
        typeId: {type: String, required: true},
        typeName: {type: String, required: true},
        gasType: {type: String, required: false, default: null},
        weight: {type: Number, required: false, default: 0},
        piece: {type: Number, required: false, default: 0},
        billNo: {type: String, required: false, default: 0},
        length: {type: Number, required: false, default: 0},
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("rawMaterial", rawMaterialStockSchema);

