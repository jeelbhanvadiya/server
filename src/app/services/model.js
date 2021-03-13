const mongoose = require( "mongoose" );

const Schema = mongoose.Schema;

const servicesSchema = new Schema(
    {
        stockNo: {type: Number},
        serviceDate: {type: Date},
        serviceManId: {type: Schema.ObjectId, required: true},
        serviceCompleteStatus: {type: Boolean, required: true},
        Feedback: {type: Boolean},
        signatureImgUrl: {type: String}
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model( "services", servicesSchema );

