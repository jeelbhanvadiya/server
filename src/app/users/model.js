const mongoose = require( "mongoose" );
const md5 = require( "md5" );

const Schema = mongoose.Schema;

const userSchema = new Schema( {
    role : {type: String, required: false},
    firstName: {type: String, required: false},
    middleName: {type: String, required: false},
    lastName: {type: String, required: false},
    email: {type: String, required: false},
    password: {type: String, required: false},
    phoneNumber: {type: Number, required: false},
    GSTNo: {type: String, required: false},
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
