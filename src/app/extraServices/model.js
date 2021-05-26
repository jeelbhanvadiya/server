const mongoose = require( "mongoose" );

const Schema = mongoose.Schema;

const servicesSchema = new Schema(
    {
        phoneNumber: {type: Number},
        serviceDate: {type: Date},
        services : [
            {
                serviceManId: {type: Schema.ObjectId, required: false},
                serviceCompleteStatus: {type: Boolean, required: false , default: false},
                Feedback: {type: Boolean , default: false},
                signatureImgUrl: {type: String ,default:null},
                serviceDate : {type: Date,default : null},
                completeDate : {type: Date,default : null},
                serviceRating: {type:Number, default:0},
                serviceBoyRating : {type:Number ,default : 0},
                remarks : {type:String ,required : false},
                acCompany : {type:String ,required : false},
                acType : {type:String ,required : false},
                description : {type:String ,required : false},
                capacity : {type:Number ,required : false},
                rating : {type:Number ,required : false},
                address : {type :Object ,required : false}
            }
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model( "extraservices", servicesSchema );

