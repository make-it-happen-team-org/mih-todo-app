'use strict';

module.exports = function (app) {
	// Root routing
	var core = require('../controllers/core.server.controller');
	app.route('/').get(core.index);
};
//# sourceMappingURL=core.server.routes.js.map
