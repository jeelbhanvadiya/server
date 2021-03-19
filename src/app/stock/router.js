require( "./model" );
const express = require( "express" );

const controller = require( "./controller" );

const router = express.Router( );

router.post( "/create", controller.createStock );

router.get("/get", controller.getStock);

router.get("/getsellstock", controller.getSellStock);

router.get("/getstockno/:stockno", controller.getStockNoWise);

router.put("/update/:id", controller.updateStock);

router.delete("/delete/:id", controller.deleteStock);

module.exports = router;
