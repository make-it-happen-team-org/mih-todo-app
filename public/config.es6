// Init the application configuration module for AngularJS application

const ApplicationConfiguration = (() => {
    // Init module configuration options
    const applicationModuleName = 'mih';
    const applicationModuleVendorDependencies = [
        'ngResource',
        'ngAnimate',
        'ui.router',
        'ui.bootstrap',
        'ui.utils',
        'ui-notification',
        'angularFileUpload',
        'modelOptions',
        'rzModule',
        'ngCookies',
        'angular-loading-bar',
        'ngDialog'
    ];
    const endpointUrl = 'http://localhost:3000';

    // Add a new vertical module
    const registerModule = function registerModule(moduleName, dependencies) {
        // Create angular module
        angular.module(moduleName, dependencies || []);

        // Add the module to the AngularJS configuration file
        angular.module(applicationModuleName).requires.push(moduleName);
    };

    return {
        applicationModuleVendorDependencies,
        applicationModuleName,
        registerModule,
        endpointUrl
    };
})();
