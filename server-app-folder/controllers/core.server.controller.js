'use strict';

/**
 * Module dependencies.
 */

exports.index = function (req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};
//# sourceMappingURL=core.server.controller.js.map
