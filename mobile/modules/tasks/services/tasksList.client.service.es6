class TasksListService {

    /** @ngInject */
    constructor() {
        Object.assign(this, {});
    }

    getFormattedProgress (task) {
        let complete   = task.progress;
        let estimation = task.estimation;

        return {
            percent: +(complete / estimation * 100).toFixed(2),
            left:    estimation - complete,
            done:    complete
        };
    };

    recalcChart (task, color1, color2) {
        let progress = this.getFormattedProgress(task);

        task.progress = angular.extend(progress, {
            progressChart: {
                data:      [{
                    value: progress.percent,
                    label: ''
                }, {
                    value: 100 - progress.percent,
                    label: ''
                }],
                colors:    [color1, color2]
            }
        });
        
        return task.progress;
    };
}

angular.module('tasks').service('TasksListService', TasksListService);
