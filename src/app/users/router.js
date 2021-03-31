require( "./model" );
const express = require( "express" );
const validateToken = require( "../../middlewares/validateToken" );

const controller = require( "./controller" );

const router = express.Router( );

router.get("/", controller.getList);

router.post( "/signup", controller.create );

router.post( "/login", controller.login );

router.put( "/edit-profile", validateToken, controller.edit );

router.post( "/forgot-password", controller.forgetPassword );

router.get( "/getservicemanlist", controller.findAllServiceManList );

router.get( "/getmanagerlist", controller.findAllManagerList );

module.exports = router;
