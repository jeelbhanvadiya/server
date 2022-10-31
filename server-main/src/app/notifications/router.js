require( "./model" );
const express = require( "express" );

const controller = require( "./controller" );

const router = express.Router( );

router.post( "/create", controller.creatNotifications );

router.get("/getall", controller.getAllNotifications);

router.delete("/delete/:id", controller.deleteNotification);

module.exports = router;
