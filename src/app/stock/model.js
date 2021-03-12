const mongoose = require( "mongoose" );

const Schema = mongoose.Schema;

const stockSchema = new Schema(
    {
        sell : {type: Boolean , default: false},
        stockNo : {type: Number, required: true},
        indoorSrNo : {type: Number ,required: true},
        outdoorSrNo : {type: Number ,required: true},
        weight: {type: Number ,required: true},
        unitIndoorNo : {type: Number ,required: true},
        unitOutdoorNo : {type: Number ,required: true},
        clientPhoneNo : {type: Number ,default : null},
        companyId : {
            type: Schema.ObjectId , ref : "company" ,required : true
        },
        billingAddress : {type: String ,required: true},
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model( "stock", stockSchema );

