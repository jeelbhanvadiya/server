const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AcSchema = new Schema(
    {
        acCapacity:  {type: Array, required: false},
        acCompanyName:  {type: Array, required: false},
        MID:  {type: Array, required: false},
        MOD:  {type: Array, required: false},
        acType:  {type: Array, required: false},
        stockNo:  {type: Number, required: false}
    }
);

module.exports = mongoose.model("acData", AcSchema);

