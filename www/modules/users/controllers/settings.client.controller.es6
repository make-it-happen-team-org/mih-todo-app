class SettingsController {
  /*@ngInject*/
  constructor(Authentication, Notification, Users, FileUploader, MIHUtils, $timeout, $window, $rootScope, $location) {
    Object.assign(this, {
      Authentication,
      Notification,
      Users,
      FileUploader,
      MIHUtils,
      $timeout,
      $window,
      $rootScope,
      $location
    });

    if (!this.Authentication.user) {
      this.$location.path('/');
    }

    this.user        = this.Authentication.user;
    this.imageURL    = this.user.profileImageURL;
    this.initFileUploader();
  }

  initFileUploader() {
    const onAfterAddingFile = (fileItem) => {
      if (this.$window.FileReader) {
        const fileReader = new this.$window.FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = (fileReaderEvent) => {
          this.$timeout(() => {
            this.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    const onSuccessItem = (fileItem, response, status, headers) => {
      this.Notification.success('file upload Success');
      angular.extend(this.user, response);
      this.cancelUpload();
    };

    const onErrorItem = (fileItem, response, status, headers) => {
      this.cancelUpload();
      this.Notification.error(response.message);
    };

    this.uploader = new this.FileUploader({
      url:    'users/picture',
      alias:  'newProfilePicture',
      onAfterAddingFile,
      onSuccessItem,
      onErrorItem
    });

    // Set file uploader image filter
    this.uploader.filters.push({
      name: 'imageFilter',
      fn (item) {
        let type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });
  }

  addNewBookedSlot() {
    this.user.predefinedSettings.booked.push({
      startTime: '14:00',
      endTime:   '15:00'
    });
  }

  removeBookedSlot(index) {
    this.user.predefinedSettings.booked.splice(index, 1);
  }

  updateUserProfile(isValid) {
    if (isValid) {
      let user = new this.Users(this.user);

      user.$update(response => {
        this.Notification.success(`Profile Saved Successfully`);
        this.user = response;
        this.$rootScope.$broadcast('updateUserInfo', this.user);
      }, response => {
        this.Notification.error(`Error: ${response.data.message}. Please try again later`);
      });
    } else {
      this.submitted = true;
    }
  }

  uploadProfilePicture() {
    this.uploader.uploadAll();
  }

  cancelUpload() {
    this.uploader.clearQueue();
    this.imageURL = this.user.profileImageURL;
  }
}

angular
  .module('users')
  .controller('SettingsController', SettingsController);
