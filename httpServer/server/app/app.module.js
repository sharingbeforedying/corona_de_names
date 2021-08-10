//angular.module('awApp', ['ngRoute', 'ui.bootstrap', 'fileDropzone']);
angular.module('awApp', ['ngSanitize', 'ui.router', 'ui.bootstrap', 'fileDropzone']);

angular.module('awApp')
       .config(function($compileProvider) {
         $compileProvider.imgSrcSanitizationWhitelist(/^\s*((https?|ftp|mailto|local|chrome-extension):|data:image\/)/);
         //$compileProvider.imgSrcSanitizationWhitelist(/^data:img\/png.*/);
         $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|local|chrome-extension):/);
       });

input_customOnChange(angular.module('awApp'));

angular.module('awApp').directive('scopeElement', function () {
    return {
        restrict:"A", // E-Element A-Attribute C-Class M-Comments
        replace: false,
        //priority: 451, //ng-init has priority level 450.
        link: function($scope, elem, attrs) {
            console.log("scopeElement()");
            $scope[attrs.scopeElement] = elem[0];
        }
    };
});


/*
  angular.module('awApp').directive('elemReady', function( $parse ) {
     return {
         restrict: 'A',
         link: function( $scope, elem, attrs ) {
            elem.ready(function(){
              $scope.$apply(function(){
                  var func = $parse(attrs.elemReady);
                  func($scope);
              })
            })
         }
      }
  })
*/
