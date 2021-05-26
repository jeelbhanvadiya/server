require( "./model" );
const express = require( "express" );

const controller = require( "./controller" );

const router = express.Router( );

router.post( "/create", controller.creatType );

router.get("/get/", controller.getType);

router.get("/getall", controller.getAllTypes);

router.put("/update-types/", controller.updateType);

router.delete("/delete/:id", controller.deleteType);

router.put("/updatesubtype/", controller.updateSubType);

router.post("/addsubtype/", controller.addSubType);

router.delete("/deletesubtype/:id", controller.deleteSubType);

module.exports = router;
