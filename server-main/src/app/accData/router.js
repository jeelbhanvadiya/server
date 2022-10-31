require( "./model" );
const express = require( "express" );

const controller = require( "./controller" );

const router = express.Router( );

router.post( "/create", controller.creatAcData );

router.get("/get", controller.getAcData);

router.put("/update/:id", controller.updateAcData);

router.delete("/delete/:id", controller.deleteAcData);

module.exports = router;
