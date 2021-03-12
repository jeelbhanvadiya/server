require( "./model" );
const express = require( "express" );

const controller = require( "./controller" );

const router = express.Router( );

router.post( "/create", controller.createStock );

router.get("/get", controller.getStock);

router.put("/update/:id", controller.updateStock);

router.delete("/delete/:id", controller.deleteStock);

module.exports = router;
