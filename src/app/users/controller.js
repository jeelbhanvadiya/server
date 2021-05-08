const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const Users = mongoose.model("users");

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
        if (req.params.email) {
            const editedUser = await Users.updateOne( {email : req.params.email}, req.body);
            if (editedUser) {
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

exports.deleteUser = async (req, res) => {
    try {
        await Users.findByIdAndDelete({_id: req.params.id})
        res.status(200).send("success");
    } catch(err) {
        res.status(422).send({error: "Error in deleting user"});
    }
}

exports.login =  (req, res) => {
     const user = Users.findOne({email: req.body.email ,active: true})
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
            message: "Some error occurred while retrieving login. or User Un Authorized"
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
                Users.findOne({_id: decoded._id})
                    .then(login => {
                        const isMatch = bcrypt.compareSync(req.body.password, login.password); // true
                        if (isMatch) {
                            req.body.new = bcrypt.hashSync(req.body.new, 8);
                            Users.findByIdAndUpdate({_id: decoded._id}, {$set: {password: req.body.new}})
                                .then(users => {
                                    return res.send(users);
                                }).catch(err => {
                                res.status(500).send({
                                    message: "The user is not available"
                                });
                            });
                        } else {
                            res.status(500).send({message: "your Current password is not match"});
                        }
                    });
            }
        })

    } else {
        return res.unauthorized();
    }
};

exports.findAllServiceManList = async (req, res) => {
    const servicemanList = await Users.find({role: 'serviceman'});
    if(servicemanList && servicemanList.length){
        return res.send({servicemanList});
    }else {
        return res.send({message: "No Service Man found"});
    }
};

exports.findAllManagerList = async (req, res) => {
    const managerList = await Users.find({role: 'manager'});
    if(managerList && managerList.length){
        return res.send({managerList});
    }else {
        return res.send({message: "No  Manager found"});
    }
};