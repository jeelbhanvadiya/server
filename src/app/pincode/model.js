const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const pincodeSchema = new Schema(
    {
        pincode: { type: String, default: null },
        areaId: { type: mongoose.Schema.Types.ObjectId, default: null },
    },
    { timestamps: true, }
);

module.exports = mongoose.model("pincode", pincodeSchema);

