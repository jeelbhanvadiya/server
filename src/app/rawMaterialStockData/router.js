require( "./model" );
require( "../remainingRawMaterial/model" );

const express = require( "express" );

const controller = require( "./controller" );

const router = express.Router( );

router.post( "/create", controller.createMaterialData );

router.post("/get", controller.getRawMaterialData);

router.put("/update/:id", controller.updateRawMaterialData);

router.delete("/delete/:id", controller.deleteRawMaterialData);

module.exports = router;