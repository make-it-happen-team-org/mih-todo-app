let socialConfig = require('../social.config.js');

module.exports = {
    app: {
        title: 'Make It Happen',
        description: 'Application for self organization',
        keywords: 'Make It Happen'
    },
    appFolder: './public/build',
    endpointUrl: process.env.ENDPOINT_URL || 'https://mih-todo-app.herokuapp.com',
    db: {
        uri: process.env.MONGODB_URI
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
        clientID: socialConfig.facebook.clientID,
        clientSecret: socialConfig.facebook.clientSecret,
        callbackURL: '/auth/facebook/callback',
        profileFields: ['email']
    },
    twitter: {
        clientID: socialConfig.twitter.clientID,
        clientSecret: socialConfig.twitter.clientSecret,
        callbackURL: '/auth/twitter/callback',
        profileFields: ['email']
    },
    vkontakte: {
        clientID: socialConfig.vkontakte.clientID,
        clientSecret: socialConfig.vkontakte.clientSecret,
        callbackURL: '/auth/vkontakte/callback',
        scope: socialConfig.vkontakte.scope,
        profileFields: ['email']
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
        // fallback email provider is hardcoded to ensure that
        // email features are working if no env variables provided
        from: process.env.MAILER_FROM || 'testmailerservice1@gmail.com',
        options: {
            service: process.env.MAILER_SERVICE_PROVIDER || 'gmail',
            auth: {
                user: process.env.MAILER_EMAIL_ID || 'testmailerservice1@gmail.com',
                pass: process.env.MAILER_PASSWORD || 'qwe123rty456'
            }
        }
    },
    migrateRedirectUrls: {
        outlook: 'https://mih-todo-app.herokuapp.com/migrate/outlook/authorize',
        google: 'https://mih-todo-app.herokuapp.com/migrate/google-calendar/authorize'
    }
};
