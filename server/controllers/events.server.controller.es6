'use strict';

var mongoose = require('mongoose'),
	ObjectId = require("mongodb").ObjectID,
	errorHandler = require('./errors.server.controller'),
	Event = mongoose.model('Activity'),
	Slot = mongoose.model('Slot'),
	_ = require('lodash');

function generateEventSlot(event) {
	return {
		duration: (new Date(event.days.endTime) - new Date(event.days.startTime)) / 1000 / 60 / 60,
		eventId: event._id,
		userId: event.user,
		title: event.title,
		start: event.days.startTime,
		end: event.days.endTime,
		className: event.className
	}
}

exports.create = function (req, res) {
	var event = new Event(req.body);

	event.user = req.user;

	event.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: err
			});
		} else {
			new Slot(generateEventSlot(event)).save(err => {
				if (err) {
					return res.status(400).send({
						message: err
					});
				}

				res.jsonp(event);
			});
		}
	});
};

exports.importOutlook = (req, res) => {
	let promises = [];

	Object.keys(req.body).forEach(i => {
		let event = new Event(req.body[i]);

		event.user = req.user;

		promises.push(new Promise((resolve, reject) => {
			Event.find({id: event.id}).exec((err, events) => {
				if (err) {
					reject({
						id: event.id,
						message: errorHandler.getErrorMessage(err)
					});
				} else if (events.length) {
					resolve({
						id: event.id,
						message: 'Already exist'
					});
				} else {
					event.save(function (err) {
						if (err) {
							reject({
								id: event.id,
								message: errorHandler.getErrorMessage(err)
							});
						} else {
							new Slot(generateEventSlot(event)).save(err => {
								if (err) {
									reject({
										id: event.id,
										message: errorHandler.getErrorMessage(err)
									});
								} else {
									resolve({
										id: event.id,
										message: 'Imported'
									});
								}
							});
						}
					})
				}
			});
		}));
	});

	Promise.all(promises).then(result => {
		res.jsonp({
			data: result
		});
	});
};

exports.read = function (req, res) {
	res.jsonp(req.event);
};

exports.update = function (req, res) {
	var event = req.event;
	event = _.extend(event, req.body);
	event.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(event);
		}
	});
};
exports.delete = function (req, res) {
	var event = req.event;
	event.remove(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(event);
		}
	});
};

/**
 * List of Events
 */
exports.list = function (req, res) {
	Event.find({
		'user': ObjectId(req.user._id),
		'type': 'event'
	}).sort('-created').populate('user', 'displayName').exec(function (err, events) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(events);
		}
	});
};

/**
 * Event middleware
 */
exports.eventByID = function (req, res, next, id) {
	Event.findById(id).populate('user', 'displayName').exec(function (err, event) {
		if (err) return next(err);
		if (!event) return next(new Error('Failed to load Event ' + id));
		req.event = event;
		next();
	});
};

/**
 * Event authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
	if (req.event.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.getSlotsByEvent = function (req, res) {
	Slot.find({eventId: req.query.eventId}).exec(function (err, slots) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(slots);
		}
	});
};

exports.deleteSlotsByEvent = function (req, res) {
	Slot.find({eventId: req.query.eventId}).remove().exec(function (err, slots) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(slots);
		}
	});
};
