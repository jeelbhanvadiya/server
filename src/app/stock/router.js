require( "./model" );
const express = require( "express" );

const controller = require( "./controller" );

const router = express.Router( );

router.post( "/create", controller.createStock );

router.get("/get", controller.getStock);

router.get("/getstockno/:stockno", controller.getStockNoWise);

router.put("/update/:id", controller.updateStock);

router.delete("/delete/:id", controller.deleteStock);

router.post("/filter", controller.filterStockData);

router.post("/filterbysell", controller.filterBySellData);

router.get("/getbyweight/", controller.getDataByCapacity);

module.exports = router;
