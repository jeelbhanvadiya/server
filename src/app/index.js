const usersRouter = require( "./users/router" );
const stockRouter = require( "./stock/router" );
const companyRouter = require( "./company/router" );
const servicesRouter = require( "./services/router" );
const sellStockRouter = require( "./sellStockData/router" );
const rawMaterialRouter = require( "./rawMaterialStockData/router" );

const validateToken = require( "../middlewares/validateToken" );

module.exports = ( app ) => {
    app.use( "/users", usersRouter );
    app.use( "/stock", stockRouter );
    app.use( "/sell-stock", sellStockRouter );
    app.use( "/company",companyRouter );
    app.use("/validatetoken",validateToken);
    app.use("/service",servicesRouter);
    app.use("/rawmatirial",rawMaterialRouter);
};
