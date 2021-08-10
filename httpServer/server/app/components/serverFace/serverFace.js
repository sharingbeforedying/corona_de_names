(function () {

  angular.module("awApp").component('serverFace', {
      templateUrl: 'app/components/serverFace/serverFace.html',
      controller: ServerFaceController,
  });

  // ServerFaceController.$inject = ['serverService'];
  function ServerFaceController(/*serverService*/) {
      var vm = this;
      // vm.localId = "";

      // vm.serverCommands = () => serverService.availableCommands();
      //
      // vm.do = (commandName) => {
      //   serverService.command(commandName);
      // };
  }

})();
