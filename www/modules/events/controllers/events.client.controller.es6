// Events controller
angular.module('events').controller('EventsController',
  ['$scope', '$rootScope', '$stateParams', '$location', '$state', 'Users', 'Authentication', 'Events', 'Notification',
    function ($scope, $rootScope, $stateParams, $location, $state, Users, Authentication, Events, Notification) {

      $scope.selectedTemplate = false;
      $scope.authentication   = Authentication;

      $scope.user = Authentication.user;

      let currentDate      = new Date(),
          defaultEventData = {
            days:            {
              startTime: currentDate,
              endTime:   currentDate
            },
            type:            'event',
            isATemplate:     false,
            withoutDates:    false,
            title:           undefined,
            validationError: undefined,
            notes:           undefined
          };
      //TODO: replace with angular.toJson()
      $scope.eventData     = JSON.parse(JSON.stringify(defaultEventData));

      let getPresetTitle = function getPresetTitle(eventPresetParam) {
        return _
          .chain(user.eventTemplates)
          .find((eventPreset) => {
            // TODO: dig into realization of commit 180b3f3
            return eventPreset.type === eventPresetParam;
          })
          .get(
            // safe property accessor. might not be saved in user preset's
            // todo: ensure template is always present for all users
            'title',

            // default value (if not found)
            `Error: Preset '${eventPresetParam}' not found`
          )
          ;
      };

      let eventPresetParam = $stateParams.eventPresetType;
      if (!_.isUndefined(eventPresetParam)) {
        // do not fill in, when no param provided
        $scope.eventData.title = getPresetTitle(eventPresetParam);
      }

      $scope.loadEventTemplate = (selectedTemplate) => {
        if (selectedTemplate) {
          $.extend($scope.eventData, selectedTemplate);
          $scope.eventData.type   = 'event';
          $scope.selectedTemplate = selectedTemplate;
          delete $scope.eventData._id;
          delete $scope.eventData.$$hashKey;
        } else {
          $scope.eventData        = angular.copy(defaultEventData);
          $scope.selectedTemplate = false;
        }
      };

      $scope.loadPredefinedEvent = () => {
        let predefinedEventType = $stateParams.eventPresetType;
        if (predefinedEventType) {
          user.eventTemplates.forEach(template => {
            if (template.type === predefinedEventType) {
              $scope.loadEventTemplate(template);
              $scope.selectedTemplate = template;
            }
          });
        }
      };

      $scope.loadPredefinedEvent();

      $scope.$on('$locationChangeSuccess', function () {
        $scope.loadPredefinedEvent();
      });

      $scope.datepicker     = {
        currentDate: currentDate,
        startDate:   {
          isOpened: false
        },
        endDate:     {
          isOpened: false
        }
      };
      $scope.openDatepicker = function ($event, openedDatepicker) {
        let closedDatepicker = openedDatepicker == 'startDate' ? 'endDate' : 'startDate';
        $event.preventDefault();
        $event.stopPropagation();
        $scope.datepicker[openedDatepicker].isOpened = true;
        $scope.datepicker[closedDatepicker].isOpened = false;
      };

      let updateEventTemplates = (model) => {
        let user = new Users($scope.user);

        if ($scope.selectedTemplate) {
          user.eventTemplates.forEach(template => {
            if (template === $scope.selectedTemplate) {
              template.lastUsingDate = new Date();
            }
          });
        }

        if (model.isATemplate) {
          model.lastUsingDate = new Date();
          user.eventTemplates.push(model);
        }

        user.$update(response => {
          Authentication.user = response;
        }, err => console.error(err));
      };

      $scope.createEvent    = function () {
        if (!$scope.eventData.title) {
          $scope.eventData.validationError = {
            message: 'Please fill the Title'
          };
          return;
        }

        if ($scope.eventData.isATemplate || $scope.selectedTemplate) {
          updateEventTemplates($scope.eventData);
        }

        const defaultTemplateType = $location.search().eventPresetType;
        let classNames            = ["event"];

        if (defaultTemplateType) {
          classNames.push(defaultTemplateType);
        }

        $scope.eventData.className = classNames;

        new Events($scope.eventData).$save(() => {
          $scope.events = [];
          $location.search('');
          $state.go('restricted.todo_state.events.list');
          $rootScope.$broadcast('NEW_EVENTS_MODIFY');
        }, err => {
          $scope.eventData.validationError = err.data.message.errors.title;
        });
      };

      $scope.findEvent      = function () {
        $scope.event = Events.get({
          eventId: $stateParams.eventId
        });
      };

      $scope.updateEvent    = function () {
        let event = $scope.event;

        event.$update(function () {
          $state.go('restricted.todo_state.events.details', { eventId: event._id });
          $rootScope.$broadcast('NEW_EVENTS_MODIFY');
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };

      $scope.deleteEvent    = function () {
        $scope.event.$remove(function () {
          $location.search('');
          $state.go('restricted.todo_state.events.list');
          Events.deleteSlotsByEvent({
              eventId: $stateParams.eventId
            }
          );
          Notification.success(`Event "${$scope.event.title}" was successfully removed`);
          $rootScope.$broadcast('NEW_EVENTS_MODIFY');
        });
      };
    }]);
