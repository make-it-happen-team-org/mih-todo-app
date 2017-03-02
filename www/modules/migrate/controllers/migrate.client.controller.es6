class MigrateController {
    constructor() {
        Object.assign(this, {
            syncService: 'sync-item-outlook'
        });
    }

    setRestrictedUrlPath() {
        return this.syncService === 'sync-item-outlook';
    }
}

angular.module('migrate').controller('MigrateController', MigrateController);
