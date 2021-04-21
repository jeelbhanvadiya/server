require( "./model" );
const express = require( "express" );

const controller = require( "./controller" );

const router = express.Router( );

const multer = require('multer');

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./signImages')
    },
    filename(req,file,cb){
        cb(null,file.originalname)
    }
})

const upload = multer({storage:storage});

router.post( "/create", controller.createServices );

router.get("/get", controller.getServiceData);

router.get("/get/:id", controller.getServicesStockNo);

router.put("/update", controller.updateService);

router.delete("/delete/:id", controller.deleteService);

router.put("/deletebyserviceid", controller.deleteByServiceId);

router.put( "/uploadsignimg/:id", upload.single('file') , controller.uploadSignImage );

router.post( "/filter", controller.filterData );

module.exports = router;
