const express = require("express");

const controller = require("./controller");

const router = express.Router();

router.get("/", controller.homePage);
router.get("/count", controller.homePageCount);

module.exports = router;
