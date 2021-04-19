const mongoose = require( "mongoose" );

const Schema = mongoose.Schema;

const servicesSchema = new Schema(
    {
        stockNo: {type: Number},
        serviceDate: {type: Date},
        services : [
            {
                serviceManId: {type: Schema.ObjectId, required: false},
                serviceCompleteStatus: {type: Boolean, required: false , default: false},
                Feedback: {type: Boolean , default: false},
                signatureImgUrl: {type: String},
                serviceDate : {type: String},
            }
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model( "services", servicesSchema );

