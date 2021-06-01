require( "./model" );
const express = require( "express" );
const validateToken = require( "../../middlewares/validateToken" );

const controller = require( "./controller" );

const router = express.Router( );

router.get("/", controller.getList);

router.post( "/signup", controller.create );

router.post( "/login", controller.login );

router.put( "/edit-profile/:email", controller.edit );

router.post( "/forgot-password", controller.forgetPassword );

router.get( "/getservicemanlist", controller.findAllServiceManList );

router.get( "/getmanagerlist", controller.findAllManagerList );

router.put("/changePassword", controller.changePassword);

const multer = require('multer');

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./profileImages')
    },
    filename(req,file,cb){
        cb(null,file.originalname)
    }
})

const upload = multer({storage:storage});

router.put("/uploadProfile", upload.single('file') , controller.uploadProfileImage );

router.delete("/delete/:id", controller.deleteUser);

module.exports = router;
