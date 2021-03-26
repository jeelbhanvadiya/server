const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sellStockSchema = new Schema(
    {
        clientPhoneNo: {type: Number, required: false},
        clientName: {type: String, required: false},
        clientComapnyName: {type: String, required: false},
        stock: [
            {
                stockNo: {type: Number, required: false},
                price: {type: Number, required: false},
                sellDate: {type: Date, required: false},
                GSTNo: {type: String, required: false},
                invoiceNo: {type: String, required: false},
                billNo: {type: String, required: false},
                billDate: {type: Date},
            }
        ],
        address: {
            houseNo: {type: String, required: false},
            streetName: {type: String, required: false},
            landmark: {type: String, required: false},
            area: {type: String, required: false},
            city: {type: String, required: false},
            state: {type: String, required: false},
            pinCode: {type: Number, required: false},
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("sellStock", sellStockSchema);

