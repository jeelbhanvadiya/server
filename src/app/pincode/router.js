require("./model");
const express = require("express");

const controller = require("./controller");

const router = express.Router();

router.post("/create", controller.add_pincode);

router.post("/get", controller.get_pincode);

module.exports = router;
