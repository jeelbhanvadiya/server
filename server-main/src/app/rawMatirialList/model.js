const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const rawmatiriallistSchema = new Schema(
    {
        description: {type: String, required: false},
        materialList: {type: Object}
    },
    {
            timestamps: true,
    }
);

module.exports = mongoose.model("rawmatiriallist", rawmatiriallistSchema);

