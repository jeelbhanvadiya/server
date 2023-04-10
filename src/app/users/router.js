require("./model");
const express = require("express");
const validateToken = require("../../middlewares/validateToken");

const controller = require("./controller");

const router = express.Router();

router.get("/", controller.getList);

router.post("/signup", controller.create);

router.post("/login", controller.login);

router.post("/notification_test", controller.notification_test);

router.post("/forgot-password", controller.forgetPassword);

router.post("/otp_verification", controller.otp_verification);

router.post("/set_password", controller.set_password);

router.put("/edit-profile/:email", controller.edit);

router.get("/getservicemanlist", controller.findAllServiceManList);

router.get("/getmanagerlist", controller.findAllManagerList);

router.put("/changePassword", controller.changePassword);

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './profileImages')
    },
    filename(req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage });

router.put("/uploadProfile", upload.single('file'), controller.uploadProfileImage);

router.delete("/delete/:id", controller.deleteUser);

router.get("/newPassword/:id", controller.renderHtmlForm);

module.exports = router;
