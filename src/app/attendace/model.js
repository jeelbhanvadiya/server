const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const attendanceSchema = new Schema(
    {
        // attendanceCount: attendaceList.length,
        description: {type: String, required: false},
        attendanceList: { type: Object }
    },
    {
            timestamps: true,
    }
);

module.exports = mongoose.model("attendanceSchema", attendanceSchema);

