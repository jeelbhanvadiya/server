const mongoose = require( "mongoose" );

const Schema = mongoose.Schema;

const servicesSchema = new Schema(
    {
        stockNo: {type: Number},
        serviceDate: {type: Date},
        serviceManId: {type: Schema.ObjectId, required: false},
        serviceCompleteStatus: {type: Boolean, required: false},
        Feedback: {type: Boolean},
        signatureImgUrl: {type: String}
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model( "services", servicesSchema );

