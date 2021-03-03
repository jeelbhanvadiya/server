const usersRouter = require( "./users/router" );
const validateToken = require( "../middlewares/validateToken" );

module.exports = ( app ) => {
    app.use( "/users", usersRouter );
    app.use("/validatetoken",validateToken);
};
