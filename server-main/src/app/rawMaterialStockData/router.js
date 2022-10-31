require( "./model" );

const express = require( "express" );

const controller = require( "./controller" );

const router = express.Router( );

router.post( "/create", controller.createMaterialData );

router.post("/get", controller.getRawMaterialData);

router.put("/update/:id", controller.updateRawMaterialData);

router.post("/delete", controller.deleteRawMaterialData);

router.delete("/delete/:id", controller.deleteRawMaterial);

module.exports = router;
