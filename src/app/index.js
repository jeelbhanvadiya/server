const homeRouter = require("./home/router");
const usersRouter = require("./users/router");
const stockRouter = require("./stock/router");
const companyRouter = require("./company/router");
const servicesRouter = require("./services/router");
const sellStockRouter = require("./sellStockData/router");
const rawMaterialRouter = require("./rawMaterialStockData/router");
const remainingRawMaterialRouter = require("./remainingRawMaterial/router");
const sellRawMatirialRouter = require("./sellRowMatirialStock/router");
const acData = require("./accData/router");
const NotificationRouter = require("./notifications/router");
const attendance = require("./attendances/router");
const rawMaterialTypesRouter = require("./rawMatirialList/router");
const extraServicesRouter = require("./extraServices/router");
const areaRouter = require("./area/router");
const pincodeRouter = require("./pincode/router");

const validateToken = require("../middlewares/validateToken");

module.exports = (app) => {
    app.use("/home_page", homeRouter);
    app.use("/users", usersRouter);
    app.use("/area", validateToken, areaRouter);
    app.use("/pincode", validateToken, pincodeRouter);
    app.use("/stock", validateToken, stockRouter);
    app.use("/sell-stock", validateToken, sellStockRouter);
    app.use("/company", validateToken, companyRouter);
    app.use("/validatetoken", validateToken);
    app.use("/service", validateToken, servicesRouter);
    app.use("/rawmatirial", validateToken, rawMaterialRouter);
    app.use("/remainingRawMaterial", validateToken, remainingRawMaterialRouter);
    app.use("/ac_data", validateToken, acData);
    app.use("/sellrawmatirial", validateToken, sellRawMatirialRouter);
    app.use("/attendance", validateToken, attendance);
    app.use("/rawmatiriallist", validateToken, rawMaterialTypesRouter);
    app.use("/notifications", validateToken, NotificationRouter);
    app.use("/extraServices", validateToken, extraServicesRouter)
};
