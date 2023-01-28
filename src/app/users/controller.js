const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const Users = mongoose.model("users");
require('dotenv').config()

const ObjectId = mongoose.Types.ObjectId
const serverConfig = require(`../../config/environments/${process.env.NODE_ENV || "production"}.js`);

exports.getList = async (req, res) => {
    try {
        const users = await Users.find({});
        res.send(users);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving login." });
    }
};

exports.edit = async (req, res) => {
    try {
        if (req.params.email) {
            const editedUser = await Users.updateOne({ email: req.params.email }, req.body);
            if (editedUser) {
                res.send({ success: true, editedUser });
            } else {
                res.send({ success: false, message: "user is not found" });
            }
        } else {
            res.send({ success: false, message: "Please send correct user info" });
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
    const findUser = await Users.findOne({ email: req.body.email.trim() });
    if (findUser && findUser._id) {
        return res.send({ message: "This user is already exist" });
    }
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    Users.create(req.body)
        .then(users => {
            res.send({ users, message: "successfully inserted" });
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the users."
            });
        });
};

exports.deleteUser = async (req, res) => {
    try {
        await Users.findByIdAndDelete({ _id: req.params.id })
        res.status(200).send("success");
    } catch (err) {
        res.status(422).send({ error: "Error in deleting user" });
    }
}

exports.login = (req, res) => {
    const user = Users.findOne({ email: req.body.email.trim(), active: true })
        .then(login => {
            const success = "Successfully Login";
            const isMatch = bcrypt.compareSync(req.body.password, login.password); // true
            if (isMatch) {
                let token = jwt.sign({ _id: login._id, email: req.body.email }, "superSuperSecret", {
                    expiresIn: '9999 years'
                });
                res.status(200).send({ users: true, token: token, login: login, success: success });
            } else {
                res.status(500).send({ message: "Password is not match" });
            }
        }).catch(err => {
            res.send({
                message: "Some error occurred while retrieving login. or User Un Authorized"
            });
        });
};

exports.forgetPassword = async (req, res) => {
    let otpFlag = 1, // OTP has already assign or not for cross-verification
        otp = 0
    try {
        if (!req.body) {
            return res.status(400).send({
                message: "Users content can not be empty"
            });
        }
        let mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });
        while (otpFlag == 1) {
            for (let flag = 0; flag < 1;) {
                otp = await Math.round(Math.random() * 1000000)
                if (otp.toString().length == 6) {
                    flag++
                }
            }
            let isAlreadyAssign = await Users.findOne({ otp: otp })
            if (isAlreadyAssign?.otp != otp) otpFlag = 0
        }
        const userDetails = await Users.findOneAndUpdate({ email: req.body.email.trim().toString() }, { otp, otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)) })
        if (userDetails && userDetails._id) {
            let mailDetails = {
                from: process.env.EMAIL,
                to: userDetails.email,
                subject: "Your Forgotton Password", // Subject line
                text: "Your Forgotton Password", // plain text body
                html: `<h3>Hello you forgot Your password.</h3><h3>OTP = ${otp}.</h3>` // html body
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
    } catch (error) {
        console.log(error)
        res.status(200).send({
            message: "Email sent successfully"
        });
    }
};

exports.otp_verification = async (req, res) => {
    reqInfo(req)
    let { otp, email } = req.body
    try {
        let data = await Users.findOneAndUpdate({ email, otp }, { otp: 0, otpExpireTime: null })

        if (!data) return res.status(400).json({ message: "Invalid OTP!" });
        if (new Date(data.otpExpireTime).getTime() < new Date().getTime()) return res.status(410).json({ message: "OTP has been expired!" });
        return res.status(200).json({ success: true, data: { _id: data?._id }, message: "OTP verified!" });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error!" });
    }
}

exports.set_password = async (req, res) => {
    reqInfo(req)
    let { userId, password } = req.body
    try {
        let data = await Users.findOneAndUpdate({ _id: ObjectId(userId) }, { password: bcrypt.hashSync(password, 8) })
        if (!data) return res.status(400).json({ message: "You've request userId not found!" });
        return res.status(200).json({ success: true, data: { _id: data?._id }, message: "New password successfully configured!" });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error!" });
    }
}

exports.changePassword = (req, res) => {
    const token = req.body.token || req.query.token || req.headers.authorization;
    if (token) {
        return jwt.verify(token, "superSuperSecret", function (err, decoded) {
            if (err) {
                logger.error(err);
                return res.json({
                    success: false,
                    message: "Failed to authenticate token.",
                });
            } else {
                Users.findOne({ _id: decoded._id })
                    .then(login => {
                        const isMatch = bcrypt.compareSync(req.body.password, login.password); // true
                        if (isMatch) {
                            req.body.new = bcrypt.hashSync(req.body.new, 8);
                            Users.findByIdAndUpdate({ _id: decoded._id }, { $set: { password: req.body.new } })
                                .then(users => {
                                    return res.send(users);
                                }).catch(err => {
                                    res.status(500).send({
                                        message: "The user is not available"
                                    });
                                });
                        } else {
                            res.status(500).send({ message: "your Current password is not match" });
                        }
                    });
            }
        })

    } else {
        return res.unauthorized();
    }
};

exports.uploadProfileImage = async (req, res) => {
    try {
        const pathName = 'profileImages/' + req.file.originalname;
        if (pathName) {
            await Users.updateOne({
                _id: req.body.id
            }, { $set: { "users.$.profileUrl": pathName } })
            res.success(pathName);
        } else {
            res.success({ success: "failed", message: "something went wrong" });
        }
    } catch (err) {
        res.send(err);
    }
};

exports.findAllServiceManList = async (req, res) => {
    const servicemanList = await Users.find({ role: 'serviceman' });
    if (servicemanList && servicemanList.length) {
        return res.send({ servicemanList });
    } else {
        return res.send({ message: "No Service Man found" });
    }
};

exports.findAllManagerList = async (req, res) => {
    const managerList = await Users.find({ role: 'manager' });
    if (managerList && managerList.length) {
        return res.send({ managerList });
    } else {
        return res.send({ message: "No  Manager found" });
    }
};

exports.renderHtmlForm = async (req, res) => {
    res.render("forgotpassword")
}