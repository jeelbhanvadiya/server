const mongoose = require("mongoose");

const Company = mongoose.model("company");

exports.createCompany = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({
                message: "Users content can not be empty"
            });
        }
        console.log(req.body)
        Company.create(req.body)
            .then(company => {
                res.status(200).send({company, message: "successfully Created company"});
            }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the company."
            });
        });
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while create company."});
    }
};

exports.getCompany = async (req, res) => {
    try {
        const stock = await Company.find({});
        res.status(200).send(stock);
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while retrieving login."});
    }
};

exports.updateCompany = async (req, res) => {
    try {
        console.log(req.params.id)
        if (req.params.id) {
            const editedCompany = await Company.findByIdAndUpdate(req.params.id, req.body);
            if (editedCompany && editedCompany.id) {
                res.status(200).send({success: true, editedCompany});
            } else {
                res.status(401).send({success: false, message: "user is not found"});
            }
        } else {
            res.status(404).send({success: false, message: "Please send correct user info"});
        }
    } catch (err) {
        res.send(err);
    }
};

exports.deleteCompany = async (req, res) => {
    try {
        await Company.deleteOne({_id: req.params.id})
        res.status(200).send("success");
    } catch(err) {
        res.status(422).send({error: "Error in getting course details"});
    }
}