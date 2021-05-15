const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const attendanceSchema = new Schema(
    {
        description: {type: String, required: false},
        attendanceList: { type: Object }
    },
    {
            timestamps: true,
    }
);

module.exports = mongoose.model("attendances", attendanceSchema);

