const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sellStockSchema = new Schema(
    {
        clientPhoneNo: {type: Number, required: true},
        clientName: {type: String, required: false},
        stock: [
            {
                stockNo: {type: String, required: true},
                price: {type: Number, required: false},
                sellDate: {type: Date, required: false},
                billingDate : {type: Date, required: false ,default: null},
                fittingDate : {type: Date, required: false ,default: null},
                GSTNo: {type: String, required: false},
                clientCompanyName: {type: String, required: false},
                unitIndoorNo : {type: String ,required: false},
                unitOutdoorNo : {type: String ,required: false},
                invoiceNo: {type: String, required: false},
                billNo: {type: String, required: false},
                billDate: {type: Date},
                CrmNo: {type: String, required: false , default : null},
                CustomerNo: {type: String, required: false ,default : null},
                Date: {type: Date, required: false,default : null},
                address: {
                    houseNo: {type: String, required: false},
                    streetName: {type: String, required: false},
                    landmark: {type: String, required: false},
                    area: {type: String, required: false},
                    city: {type: String, required: false},
                    state: {type: String, required: false},
                    pinCode: {type: Number, required: false},
                },
                billingAddress: {
                    houseNo: {type: String, required: false},
                    streetName: {type: String, required: false},
                    landmark: {type: String, required: false},
                    area: {type: String, required: false},
                    city: {type: String, required: false},
                    state: {type: String, required: false},
                    pinCode: {type: Number, required: false},
                }
            }
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("sellStock", sellStockSchema);

