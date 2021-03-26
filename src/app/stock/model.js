const mongoose = require( "mongoose" );

const Schema = mongoose.Schema;

const stockSchema = new Schema(
    {
        sell : {type: Boolean , default: false},
        stockNo : {type: Number, required: false},
        indoorSrNo : {type: Number ,required: false},
        outdoorSrNo : {type: Number ,required: false},
        weight: {type: Number ,required: false},
        unitIndoorNo : {type: Number ,required: false},
        unitOutdoorNo : {type: Number ,required: false},
        clientPhoneNo : {type: Number ,default : null},
        invoiceNo : {type: String },
        invoiceDate : {type: Date},
        companyId : {
            type: Schema.ObjectId , ref : "company" ,required : false
        },
        billingAddress : {type: String ,required: false},
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model( "stock", stockSchema );

