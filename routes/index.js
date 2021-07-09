"use strict";

const includeAllRoutes = (app, connection) => {
require('./users-api')(app, connection);
}
module.exports = (app, connection) => {
	includeAllRoutes(app, connection);
};
