require("./model");
const express = require("express");

const controller = require("./controller");

const router = express.Router();

router.post("/create", controller.add_area);

router.post("/get", controller.get_area);

module.exports = router;
