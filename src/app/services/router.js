require("./model");
const express = require("express");

const controller = require("./controller");

const router = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './signImages')
    },
    filename(req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage });

router.post("/create", controller.createServices);

router.get("/get", controller.getServiceData);

router.get("/count", controller.countService);

router.post("/pending_service", controller.pendingServicePagination);

router.post("/completed_service", controller.completedServicePagination);

router.post("/total_service", controller.totalServicePagination);

router.post("/get_service_man_id", controller.get_service_by_serviceMan_id);

router.get("/get/:id", controller.getServicesStockNo);

router.put("/update", controller.updateService);

router.put("/update/full_detail", controller.updateServiceFullDetails);

router.delete("/delete/:id", controller.deleteService);

router.put("/deletebyserviceid", controller.deleteByServiceId);

router.put("/uploadsignimg", upload.single('file'), controller.uploadSignImage);

router.post("/filter", controller.filterData);

router.post("/update/servicemainid", controller.serviceMainIdUpdate);

module.exports = router;
