const usersRouter = require( "./users/router" );
const stockRouter = require( "./stock/router" );
const companyRouter = require( "./company/router" );
const servicesRouter = require( "./services/router" );
const sellStockRouter = require( "./sellStockData/router" );
const rawMaterialRouter = require( "./rawMaterialStockData/router" );
const remainingRawMaterialRouter = require( "./remainingRawMaterial/router" );
const sellRawMatirialRouter = require("./sellRowMatirialStock/router");
const acData = require("./accData/router");

const validateToken = require( "../middlewares/validateToken" );

module.exports = ( app ) => {
    app.use( "/users", usersRouter );
    app.use( "/stock", stockRouter );
    app.use( "/sell-stock", sellStockRouter );
    app.use( "/company",companyRouter );
    app.use("/validatetoken",validateToken);
    app.use("/service",servicesRouter);
    app.use("/rawmatirial",rawMaterialRouter);
    app.use("/remainingRawMaterial",remainingRawMaterialRouter);
    app.use("/ac_data",acData)
    app.use("/sellrawmatirial",sellRawMatirialRouter)
};
