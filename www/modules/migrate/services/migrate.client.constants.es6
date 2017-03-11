angular.module('migrate')
       .constant('MigrateConstants', {
         dateFormat: 'yyyy-MM-dd',
         google:     {
           token:       {
             access:  'google_calendar_access_token',
             refresh: 'google_calendar_refresh_token'
           },
           limitEvents: 10
         },
         outlook:    {
           token: {
             access: 'outlook_access_token'
           },
           email: 'outlook_email'
         }
       });
