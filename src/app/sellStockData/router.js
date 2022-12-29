require("./model");
require("../stock/model");

const express = require("express");

const controller = require("./controller");

const router = express.Router();

router.post("/create", controller.createSellStock);

router.post("/get", controller.getSellStock);

router.get("/get/unique_fields", controller.getSellStock);

router.post("/update-stock-data", controller.updateSellStock);

router.delete("/delete/:id", controller.deleteSellStock);

router.post("/:stockno", controller.getSellStockStockNo);

router.get("/searching", controller.searchingSellStock);

router.put("/update-sell-data", controller.updateSellData);

module.exports = router;
