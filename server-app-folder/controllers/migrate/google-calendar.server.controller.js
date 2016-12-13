const google = require('googleapis');
const googleAuth = require('google-auth-library');
const config = require('../../../config/config');

const googleCalendarConfig = config.migrate.google;
const credentials = googleCalendarConfig.credentials;

const CALENDAR_ID = 'primary';
const ORDER_BY = 'startTime';
const DEFAULT_MAX_RESULTS = 10;

function getAuthModel() {
    const {client_secret, client_id} = credentials.installed;
    const redirect_url = config.migrateRedirectUrls.google;

    const auth = new googleAuth();

    return new auth.OAuth2(client_id, client_secret, redirect_url);
}

module.exports = {
    getAuthUrl: (req, res) => {
        const authUrl = getAuthModel().generateAuthUrl({
            access_type: googleCalendarConfig.access_type,
            scope: googleCalendarConfig.scope
        });

        res.json({url: authUrl});
    },

    getTokenFromCode: (req, res) => {
        const code = req.query.code;

        if (!code) {
            console.log('Access token error');

            return res.redirect(googleCalendarConfig.uiRedirectUrl);
        }

        getAuthModel().getToken(code, (err, data) => {
            if (err) {
                console.log('Error while trying to retrieve access token', err);

                return res.redirect(googleCalendarConfig.uiRedirectUrl);
            }

            res.cookie('google_calendar_access_token', data.access_token, {maxAge: googleCalendarConfig.cookieMaxAge});
            res.cookie('google_calendar_refresh_token', data.refresh_token, {maxAge: googleCalendarConfig.cookieMaxAge});

            return res.redirect(googleCalendarConfig.uiRedirectUrl);
        });
    },

    getCalendarEvents: (req, res) => {
        const oauth2Client = getAuthModel();
        const startDate = req.query.startDate ? (new Date(req.query.startDate)).toISOString() : (new Date()).toISOString();

        oauth2Client.credentials = {
            access_token: req.query.accessToken,
            refresh_token: req.query.refreshToken
        };

        google.calendar('v3').events.list({
            auth: oauth2Client,
            calendarId: CALENDAR_ID,
            timeMin: startDate,
            maxResults: req.query.maxResults || DEFAULT_MAX_RESULTS,
            singleEvents: true,
            orderBy: ORDER_BY
        }, (err, response) => {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }

            res.json(response);
        });
    }
};