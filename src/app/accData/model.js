const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AcSchema = new Schema(
    {
        "acCapacity": Number,
        "acCompanyName": String,
        "MID": String,
        "MOD": String,
        "acType": String
    }
);

module.exports = mongoose.model("acData", AcSchema);

