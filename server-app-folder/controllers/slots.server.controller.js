const SlotEmailNotificationCtrl = require('./notifications-by-email.server.controller').EmailSlots;

var mongoose     = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    moment       = require('moment'),
    Slot         = mongoose.model('Slot'),
    _            = require('lodash');

// TODO: where to place this call - to be called once (as is here)?
// TODO: figure out if require() of the module calls fn twice
new SlotEmailNotificationCtrl();

function recalcTimeForSlotsWithinDayByPriority(req, res, cfg) {
    let workingHours   = req.user.predefinedSettings.workingHours,
        workingDay     = moment(cfg.newSlot.start).format('dddd').toLowerCase().slice(0, 3),
        timeForSlot    = workingHours[workingDay].start.split(':'),
        hoursForSlot   = parseInt(timeForSlot[0], 10),
        minutesForSlot = parseInt(timeForSlot[1], 10);

    Slot.find({
        taskId: { $exists: true },
        start:  { $gte: new Date(cfg.newSlot.start.toUTCString()) },
        end:    { $lte: new Date(cfg.newSlot.end.toUTCString()) },
        userId: req.user._id
    }).sort({ priority: 1 }).exec((err, slots) => {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            slots.forEach((slot) => {
                slot.start = cfg.newSlot.start.setHours(hoursForSlot, minutesForSlot);
                slot.end   = cfg.newSlot.end.setHours(hoursForSlot + slot.duration, minutesForSlot + slot.duration % 1 * 60);

                slot.save((err) => {
                    if (err) {
                        return res.status(400).send({
                            message: err
                        });
                    }
                });

                hoursForSlot += parseInt(slot.duration, 10);
                minutesForSlot = (minutesForSlot + slot.duration % 1 * 60) % 60;
            });

            SlotEmailNotificationCtrl.doScheduleEmailForFutureSlot(cfg.newSlot);
            cfg.resolve(true);
        }
    });
}

exports.list = function (req, res) {
    Slot.find({
        start:  { $gte: new Date(req.query.start).toUTCString() },
        end:    { $lte: new Date(req.query.end).toUTCString() },
        userId: req.user._id
    }).exec((err, slots) => {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(slots);
        }
    })
};

exports.create = function (req, res) {
    let promises = [];
    Object.keys(req.body).forEach((key) => {
        promises.push(new Promise((resolve) => {
            let newSlot = new Slot(req.body[key]);
            newSlot.save((error) => {
                if (error) {
                    resolve(false);
                } else {
                    if (newSlot.eventId) {
                        resolve(true);
                        return;
                    }
                    recalcTimeForSlotsWithinDayByPriority(req, res, { newSlot, resolve });
                }
            });
        }));
    });
    Promise.all(promises).then(result => {
        if (result.indexOf(false) == -1) {
            return res.status(200).send();
        } else {
            return res.status(400).send();
        }
    });
};

exports.remove = function (req, res) {

};

exports.read = function (req, res) {

};

exports.update = function (req, res) {
    var slot = req.slot;

    slot = _.extend(slot, req.body);

    slot.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(slot);
        }
    });
};

exports.slotByID = function (req, res, next, id) {
    Slot.findById(id).exec((err, slot) => {
        if (err) return next(err);
        if (!slot) return next(new Error('Failed to load Slot ' + id));
        req.slot = slot;
        next();
    });
};