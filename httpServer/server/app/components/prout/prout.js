(function () {

  angular.module('awApp').component('prout', {
    templateUrl: 'app/components/prout/prout.html',
    controller: ProutController,
  });

  ProutController.$inject = ['$scope', 'gameService', '$injector'];
  function ProutController($scope, gameService, $injector) {
    var vm = this;

    vm.x = "A";

    vm.actions = {
      join : {
        name: "join session",
        go : join,
      },
      detail : {
        name: "show detail",
        go : detail,
      }
    }

    vm.actionsPopover = {
      actions: vm.actions,
      templateUrl: "'app/shared/templates/actionsPopoverTemplate.html'",
      title: 'Actions'
    };

    function join() {
      console.log("join");
    }

    function detail() {
      console.log("detail");
    }



    activate();

    function activate() {
      console.log("ProutController::activate");

      // const exist = $injector.has('myDirective');
      console.log("$injector.has('$uibPopover')", $injector.has('$uibPopover'));
      console.log("$injector.has('$uibModal')", $injector.has('$uibModal'));


      function setValues() {
        vm.x = "B";
      }

      gameService.onChange(() => {
        console.log("ProutController::gameService.onChange");

        setValues();
        $scope.$apply();
      });


    };

  }

})();
