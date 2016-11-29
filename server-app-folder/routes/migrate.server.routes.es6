'use strict';

module.exports = function (app) {
    const outlook = require('../controllers/migrate/outlook.server.controller');
    const googleCalendar = require('../controllers/migrate/google-calendar.server.controller');

    app.route('/migrate/outlook/get-auth-url').get(outlook.getAuthUrl);
    app.route('/migrate/outlook/authorize').get(outlook.getTokenFromCode);
    app.route('/migrate/outlook/get-calendar-events').get(outlook.getCalendarEvents);

    app.route('/migrate/google-calendar/get-auth-url').get(googleCalendar.getAuthUrl);
    app.route('/migrate/google-calendar/authorize').get(googleCalendar.getTokenFromCode);
    app.route('/migrate/google-calendar/get-calendar-events').get(googleCalendar.getCalendarEvents);
};
