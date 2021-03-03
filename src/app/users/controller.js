const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const Users = mongoose.model("User");

exports.getList = async (req, res) => {
    try {
        const users = await Users.find({});
        res.send(users);
    } catch (err) {
        res.status(500).send({message: err.message || "Some error occurred while retrieving login."});
    }
};

exports.edit = async (req, res) => {
    try {
        if (req.body.id) {
            const editedUser = await Users.findByIdAndUpdate(req.body.id, req.body);
            if (editedUser && editedUser._id) {
                res.send({success: true, editedUser});
            } else {
                res.send({success: false, message: "user is not found"});
            }
        } else {
            res.send({success: false, message: "Please send correct user info"});
        }
    } catch (err) {
        res.send(err);
    }
};

exports.create = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Users content can not be empty"
        });
    }
    const findUser = await Users.findOne({email: req.body.email});
    if(findUser && findUser._id){
        return res.send({message: "This user is already exist"});
    }
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    Users.create(req.body)
        .then(users => {
            res.send({users, message: "successfully inserted"});
        }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the users."
        });
    });
};

exports.login = (req, res) => {
    Users.findOne({email: req.body.email})
        .then(login => {
            const success = "Successfully Login";
            const isMatch = bcrypt.compareSync(req.body.password, login.password); // true
            if (isMatch) {
                let token = jwt.sign({_id: login._id, email: req.body.email}, "superSuperSecret", {
                    expiresIn: 3600
                });
                res.status(200).send({users: true, token: token, login: login,success :success});
            } else {
                res.status(500).send({message: "Password is not match"});
            }
        }).catch(err => {
        res.send({
            message: err.message || "Some error occurred while retrieving login."
        });
    });
};

exports.forgetPassword = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Users content can not be empty"
        });
    }
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jeel.bvminfotech@gmail.com',
            pass: ''
        }
    });

    const userDetails = await Users.findOne({email: req.body.email})
    if (userDetails && userDetails._id) {
        let mailDetails = {
            from: 'jeel.bvminfotech@gmail.com',
            to: userDetails.email,
            subject: "Your Forgotton Password", // Subject line
            text: "Your Forgotton Password", // plain text body
            html: `<b>Hello you forgot Your password so below link is for reseting password click below.</b> <span>http://localhost:3000/newPassword/${userDetails._id}</span>` // html body
        };
        mailTransporter.sendMail(mailDetails, function (err, data) {
            if (err) {
                console.log('Error Occurs', err);
            } else {
                console.log('Email sent successfully');
                res.status(200).send({
                    message: "Email sent successfully"
                });
            }
        });
    }
};
