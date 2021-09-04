const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const remainingRawMaterialStockSchema = new Schema(
    {
        typeId: {type: String, required: true},
        weight: {type: Number, required: false, default: 0},
        piece: {type: Number, required: false, default: 0},
        length : {type:Number,required : false, default: 0}
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("remainingRawMaterial", remainingRawMaterialStockSchema);

