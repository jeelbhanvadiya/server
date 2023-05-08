require("./model");
const express = require("express");

const controller = require("./controller");

const router = express.Router();

router.post("/create", controller.createData);

router.post("/get", controller.getSellRawMatirialStock);

router.post("/pagination", controller.sellRawMaterialPaginationAPI);

router.get("/count", controller.countSellRawMaterialStock);

router.put("/update/:id", controller.updateData);

router.delete("/delete/:id", controller.deleteData);

module.exports = router;
