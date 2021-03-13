const mongoose = require( "mongoose" );
const md5 = require( "md5" );

const Schema = mongoose.Schema;

const userSchema = new Schema( {
    role : {type: String, required: true},
    firstName: {type: String, required: true},
    middleName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    phoneNumber: {type: Number, required: true},
    address: {
        houseNo: String,
        streetName : String,
        landMark : String,
        area : String,
        city : String,
        state : String,
        pinCode : Number
    }
}, {
    timestamps: true,
} );

userSchema.methods.setPass = function( password ) {
    this.password = md5( password );
};

userSchema.methods.checkPass = function( password ) {
    return this.password === md5( password );
};

module.exports = mongoose.model( "users", userSchema );
