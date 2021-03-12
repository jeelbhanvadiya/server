const mongoose = require( "mongoose" );

const Schema = mongoose.Schema;

const sellStockSchema = new Schema(
    {
    clientPhoneNo: {type: Number, required: true},
    clientName: {type: String, required: true},
    clientComapnyName: {type: String, required: true},
    stock: [
        {
            stockNo: {type: Number, required: true},
            price: {type: Number, required: true},
            sellDate: {type: Date, required: true},
            GSTNo: {type: String, required: true},
            invoiceNo: {type: String, required: true},
        }
    ],
    Address: {
        houseNo: {type: String, required: true},
        streetName: {type: String, required: true},
        landmark: {type: String, required: true},
        area: {type: String, required: true},
        city: {type: String, required: true},
        state: {type: String, required: true},
        pinCode: {type: Number, required: true},

}
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model( "sellStock", sellStockSchema );

