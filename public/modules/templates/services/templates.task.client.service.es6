class TemplatesService {
    getById(user, id, type) {
        return user[type].find(template => template._id == id);
    }

    getLastUsed(templateType, user) {
        console.log('template get last used', user['eventTemplates']);
        return user[templateType]
                .filter((value) => { return value.type !== 'vacation' && value.type !== 'sick'})
                .sort((current, next) => current.lastUsingDate < next.lastUsingDate)[0] || {};
    }
}

angular.module('templates').service('TemplatesService', TemplatesService);
