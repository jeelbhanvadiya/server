require( "./model" );
const express = require( "express" );

const controller = require( "./controller" );

const router = express.Router( );

router.post( "/create", controller.createCompany );

router.get("/get", controller.getCompany);

router.put("/update/:id", controller.updateCompany);

router.delete("/delete/:id", controller.deleteCompany);

module.exports = router;
