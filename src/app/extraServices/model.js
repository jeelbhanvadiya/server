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
                address : {type :String ,required : false}
            }
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model( "extraservices", servicesSchema );

