require( "./model" );
require("../accData/model");
const express = require( "express" );

const controller = require( "./controller" );

const router = express.Router( );

router.post( "/create", controller.createStock );

router.post( "/migration", controller.migrationStock );

router.get("/get", controller.getStock);

router.get("/getstockno/:stockno", controller.getStockNoWise);

router.put("/update/:id", controller.updateStock);

router.put("/edit/:stockNo", controller.editStock);

router.delete("/delete/:id", controller.deleteStock);

router.post("/filter", controller.filterStockData);

router.post("/filterbysell", controller.filterBySellData);

router.get("/getstockbyremaining/", controller.getDataByCapacity);

router.get("/getstockbysell/", controller.getDataByCapacityTrue);

module.exports = router;
