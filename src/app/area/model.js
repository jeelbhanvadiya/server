const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const areaSchema = new Schema(
    {
        name: { type: String, default: null },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("area", areaSchema);

