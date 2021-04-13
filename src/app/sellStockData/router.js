require( "./model" );
require( "../stock/model" );

const express = require( "express" );

const controller = require( "./controller" );

const router = express.Router( );

router.post( "/create", controller.createSellStock );

router.post("/get", controller.getSellStock);

router.put("/update/:id", controller.updateSellStock);

router.delete("/delete/:id", controller.deleteSellStock);

router.post("/:stockno", controller.getSellStockStockNo);

module.exports = router;
