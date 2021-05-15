require( "./model" );
const express = require( "express" );

const controller = require( "./controller" );

const router = express.Router( );

router.post( "/create", controller.creatAttendance );

router.get("/get/", controller.getAttendance);

router.put("/update-attendance/", controller.updateAttendance);

router.delete("/delete/:id", controller.deleteAttendance);

module.exports = router;
