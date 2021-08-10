var myApp = angular.module('myApp', []);

myApp.controller("myController", function($scope, $http) {
  $scope.listePerso = [];

  $scope.affichage = function() {
    //ici les console.log apparaitront dans la console du navigateur
    console.log("yey");

    $http.get('api/affiche')
         .then(function mySuccess(response) {
            console.log(response);
            $scope.myJson = response.data;
          }, function myError(response) {
              //erreur !
              console.log("$http.get('/api/affiche') -> error:", response);
         });

  };

});
