const usersRouter = require( "./users/router" );
const stockRouter = require( "./stock/router" );
const companyRouter = require( "./company/router" );

const validateToken = require( "../middlewares/validateToken" );

module.exports = ( app ) => {
    app.use( "/users", usersRouter );
    app.use( "/stock", stockRouter );
    app.use( "/company",companyRouter );
    app.use("/validatetoken",validateToken);
};
