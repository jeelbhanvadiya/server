const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const remainingRawMaterialStockSchema = new Schema(
    {
        typeId: {type: String, required: true},
        weight: {type: Number, required: false},
        piece: {type: Number, required: false},
        length : {type:Number,required : false}
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("remainingRawMaterial", remainingRawMaterialStockSchema);

