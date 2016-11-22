# JS Code style notes

## Common

  ```
    function getSomething(fromThisArgument) {
      if (!fromThisArgument) {
        return null;
      }

      const someConstant = 'magic value';
      const someObject   = { key: 'value' };
      const someArray    = [1, 2, 3];
      let result         = getAnother(someObject, someArray);

      if (!result) {
        result = {};
      }

      return {
        index: someConstant,
        list : someArray,
        result
      };
    }

    function getPoints(fromMap) {
      return fromMap.filter(record => record.includePoints)
        .map(record => record.points);
    }
  ```

Pay attention on:
- spaces around function name, arguments, braces, inside object and array literals.
- 2 spaces indentation
- usage single quotes for strings only
- we don't quote keys for objects unless this is required
- usage of curly braces even if we have one statement
- negation of conditions to reduce nesting and usage of ```return``` instead of ```else``` in such cases
- empty lines after blocks, _VARIABLES_ and before ```return```
- usage of ```let``` and ```const``` instead of ```var```
- usage of semicolons ONLY where they are needed by the standard
- usage of arrow functions with one argument
- piping on new line
- prefer usage of array methods instead of complex loops

Also:
- function complexity shouldn't be higher than 7
- maximum nesting of blocks is 3
- maximum function length is 15 statements
- maximum function parameters is 5
- maximum nesting of callbacks is also 3
- we use methods to control context instead of saving context into variables. So ```const self = this``` is forbidden


## ES6
ES6 is mandatory. Usage of old patterns that have alternatives in ES6 are forbidden:
- ```const``` and ```let``` instead of ```var```
- rest parameters instead of ```arguments```
- spread operator instead of ```.apply()```
- object and array destructuring
- destructuring in function parameters
- default parameters instead of checking them inside functions
- classes instead of prototypes
- arrow functions to callbacks instead of functions
- single arrow operator's parameter should not be wrapped in braces


## Classes
Don't use ```_``` (underscore) for private methods or properties.
Use documentation annotation for this.


## Angular code style notes

### Naming
Controller names should start with uppercase letter and finishes with Controller
Service name should start from uppercase if it is instantiable value or with lowercase if not and finishes with **Service**
Factory name should start from uppercase if it is instantiable value or with lowercase if not and finishes with **Factory**
Value name should start from uppercase if it is instantiable value or with lowercase if not and finishes with **Value**
Constant name should start from uppercase if it is instantiable value or with lowercase if not and finishes with **Constant** suffixes (accordingly)

File name should have the pattern:
> <dashed-component-name>.<type>.js
>
> for example for *'SomeViewCtrl'* controller file name is **some-view.controller.js*

### Components
There should be one component per file. The exception here is some small variables or constants.

Rest service is used for server interaction is *$resource* and it is forbidden to use any other.
Also it is forbidden to inject this service into a controller or a directive.

Dependencies for components should go sorted alphabetically

### Controllers
controllerAs syntax should be used. Injection of $scope is prohibited unless this is strongly needed.
$rootScope should be injected only for emitting/listening message. Broadcasting on a $rootScope is forbidden.


### Injections
We don't use inline array or $inject property annotation.
In this case we can use /*@ngInject*/ syntax to force it.

Maximum parameters allowed for the function is 5.
The common template is to use $injector service to inject all the dependencies
Also we have locals that can't be injected with $inject service.
If you have more than 4 locals it says that something wrong with the design and you should reconsider it.

So here is a proper example

  ```
    class MyCtrl {
      /\*@ngInject\*/
      constructor($injector, $element) {
        this.someService = $injector.get('mihSomeService');
        this.$element = $element;
      }

      $onInit() {
        this.$element.addClass(this.someService.getClass());
      }
    }
  ```


## Documentation

Documentation is mandatory. Each component, service, class, method or property should have documentation.
Including private and protected methods. Remember to set directives for these methods and properties too

Documentation comments should be proper ngdoc annotations.

### Module

  ```
    /**
     * @ngdoc overview
     * @name <name>
     * @description
     *
     * <description>
     */
  ```


### Services

  ```
    /**
     * @ngdoc service
     * @name <module```name>.<service```name>
     *
     * @description <description>
     */
  ```


### Controller

  ```
    /**
     * @ngdoc controller
     * @name <module```name>.<controller```name>
     * @extends <module```name>.<controller```name>
     * @class
     *
     * @description <description>
     */
  ```

### Directive or component

  ```
    /**
     * @ngdoc directive
     * @name <module```name>.<directive```name>
     * @restrict <restrict>
     *
     * @description <description>
     */
  ```

  With isolated scope:

  ```
    /**
     * @ngdoc directive
     * @name <module```name>.<directive```name>
     * @restrict <restrict>
     *
     * @scope
     * @property {<type>} <name> <description>
     *
     * @description <description>
     */
  ```

### Method

  ```
    /**
     * @ngdoc method
     * @methodOf <object```name>
     * @name <object```name>#<method```name>
     *
     * @param {<type>} <name> <description>
     * @returns {<type>} <description>
     * @private / @protected
     *
     * @description <description>
     */
   ```

### Property

  ```
    /**
     * @ngdoc property
     * @propertyOf <object```name>
     * @name <object```name>#<method```name>
     * @private / @protected
     *
     * @description <description>
     */
  ```
