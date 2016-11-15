// TODO: refactor into a directive, with isolate scope
// TODO: scope.$watch( element.value ) ?
// TODO: injectable service works, but is not a perfect idea

class MIHUtils {
  static convertMultipleSpaces(model, prop) {
    model[prop] = model[prop].replace(/\s+/g, ' ');
  }
}

angular.module('mih.utils')
  .factory('MIHUtils', MIHUtils);
