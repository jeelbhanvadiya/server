const mongoose = require( "mongoose" );
const Float = require('mongoose-float').loadType(mongoose);
const Schema = mongoose.Schema;

const stockSchema = new Schema(
    {
        sell : {type: Boolean , default: false},
        stockNo : {type: Number, required: false},
        indoorSrNo : {type: String ,required: false},
        outdoorSrNo : {type: String ,required: false},
        weight: {type: Float ,required: false},
        unitIndoorNo : {type: String ,required: false},
        unitOutdoorNo : {type: String ,required: false},
        clientPhoneNo : {type: Number ,default : null},
        invoiceNo : {type: String },
        invoiceDate : {type: Date},
        acType: {type:String},
        acCompanyName: {type : String},
        star:{type:Number},
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

