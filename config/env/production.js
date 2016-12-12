'use strict';

module.exports = {
    app: {
        title: 'Make It Happen',
        description: 'Application for self organization',
        keywords: 'Make It Happen'
    },
    endpointUrl: 'https://make-it-happen-app.herokuapp.com/',
    db: {
        uri: 'mongodb://devuser:devuser2day@ds031167.mlab.com:31167/mih'
    },
    log: {
        format: 'combined',
        options: {
            stream: 'access.log'
        }
    },
    assets: {
        lib: {
            css: [
                'inspinia/css/lib.min.css'
            ],
            js: [
                'js/lib.min.js'
            ]
        },
        css: [
            'css/app.min.css'
        ],
        js: [
            'js/app.min.js'
        ]
    },
    facebook: {
        clientID: process.env.FACEBOOK_ID || 'APP_ID',
        clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
        callbackURL: '/auth/facebook/callback'
    },
    twitter: {
        clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
        clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
        callbackURL: '/auth/twitter/callback'
    },
    google: {
        clientID: process.env.GOOGLE_ID || 'APP_ID',
        clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
        callbackURL: '/auth/google/callback'
    },
    linkedin: {
        clientID: process.env.LINKEDIN_ID || 'APP_ID',
        clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
        callbackURL: '/auth/linkedin/callback'
    },
    github: {
        clientID: process.env.GITHUB_ID || 'APP_ID',
        clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
        callbackURL: '/auth/github/callback'
    },
    mailer: {
        from: process.env.MAILER_FROM || 'MAILER_FROM',
        options: {
            service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
            auth: {
                user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
                pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
            }
        }
    },
    migrateRedirectUrls: {
        outlook: 'https://make-it-happen-app.herokuapp.com/migrate/outlook/authorize',
        google: 'https://make-it-happen-app.herokuapp.com/migrate/google-calendar/authorize'
    }
};
