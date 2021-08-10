(function () {

  angular.module("awApp").component('tellerHintCn', {
      templateUrl: 'app/components/instance/cn/teller/tellerHint/tellerHintCn.html',
      controller: TellerHintController,

      bindings: {
        // roomService: '<',
        onSubmitHint: "&",
      },
  });

  TellerHintController.$inject = [/*'$scope',*/ '$state', 'navigationService'];
  function TellerHintController(/*serverService,*/ $state, navigationService) {
      var vm = this;
      // vm.localId = "";
      // vm.connect = () => serverService.connect();

      console.log("TellerHintController");

      vm.$onInit = function() {
        console.log("TellerHintController::$onInit");

        //number
        vm.number = -1;
        vm.manageNumberChange = function(number) {
          console.log("manageNumberChange:", number);

          // vm.number = number;
        };

        //word
        vm.word = "hint";
        vm.wordDidUpdate = function(word) {
          console.log("wordDidUpdate", word);
          vm.word = word;
        };

        //submit
        vm.submitHint = function() {
          const word   = vm.word;
          const number = vm.number;

          const hint = {
            word: word,
            number: number,
          };

          console.log("submitHint", hint);
          vm.onSubmitHint({
            hint: hint,
          });

        };


        //---style
        vm.style = function() {
          return {
            // "background-color" : hexToRgba_cssString($scope.teamColor(), 0.5),
          };
        }

      }

  }

})();
