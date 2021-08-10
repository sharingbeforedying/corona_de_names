(function () {

  angular.module("awApp").component('localGroup', {
      templateUrl: 'app/components/debug/a1/localGroup/localGroup.html',
      controller: LocalGroupController,

      bindings: {
        stateService : "<",
        cmdService   : "<",
        moveToService   : "<",
      },
  });

  LocalGroupController.$inject = ['$state', '$uibModal', '$scope'];
  function LocalGroupController($state, $uibModal, $scope) {
      console.log("LocalGroupController");
      var vm = this;

      vm.group        = null;

      vm.createGroup  = createGroup;
      vm.removePlayer = removePlayer;
      // vm.addPlayer      = addPlayer;
      vm.update = update;

      vm.actions = {
        log_in : {
          name: "log in",
          go : log_in,
        },
        create_profile : {
          name: "create profile",
          go : create_profile,
        },
        noProfile : {
          name: "player without profile",
          go : addPlayer_noProfile,
        }
      }

      vm.actionsPopover = {
        actions: vm.actions,
        templateUrl: "'app/shared/templates/actionsPopoverTemplate.html'",
        title: 'Actions'
      };

      vm.$onInit = function() {
        console.log("LocalGroupController::$onInit");
        console.log("stateService", vm.stateService);
        console.log("cmdService",   vm.cmdService);


        vm.stateService.rx_group.pipe(rxjs.operators.take(1)).subscribe({
          next(x) { console.log('rx_group', 'got value ' + x);
            vm.group = x;
            // $scope.$apply();
          },
          error(err) { console.error('rx_group', 'something wrong occurred: ' + err); },
          complete() { console.log('rx_group', 'done'); }
        });

        vm.stateService.rx_group.pipe(rxjs.operators.skip(1)).subscribe({
          next(x) { console.log('rx_group', 'got value ' + x);
            vm.group = x;
            $scope.$apply();
          },
          error(err) { console.error('rx_group', 'something wrong occurred: ' + err); },
          complete() { console.log('rx_group', 'done'); }
        });
      }

      ////////

      function createGroup() {
        vm.cmdService.group_create();
      }

      function log_in() {
        console.log("log_in");
        // gameService.group_addPlayer(nickname);

        //show modal
        var modalInstance = $uibModal.open({
          //animation: vm.animationsEnabled,
          component: 'loginModal',
          resolve: {
            login    : () => "123",
            password : () => "456",
          }
        });

        modalInstance.result.then(function (credentials) {
          vm.cmdService.group_createPlayer_loginProfile({
            profileCredentials: credentials,
          });
        }, function () {
          // $log.info('modal-component dismissed at: ' + new Date());
        });
      }

      function create_profile() {
        console.log("create_profile");
        $state.go("profile.create");
      }

      function addPlayer_noProfile(nickname) {
        console.log("addPlayer_noProfile");
        // gameService.group_addPlayer_noProfile(nickname);

        //show modal
        var modalInstance = $uibModal.open({
          //animation: vm.animationsEnabled,
          component: 'noProfileModal',
          resolve: {
            name     : () => "dinok123",
            // img      : () => "dinok123",
          }
        });

        modalInstance.result.then(function (noProfileSettings) {
          vm.cmdService.group_createPlayer_noProfile({
            form: noProfileSettings,
          });
        }, function () {
          // $log.info('modal-component dismissed at: ' + new Date());
        });
      }

      vm.auto = function(nb) {

        vm.cmdService.group_create();

        (new Array(nb)).fill(0).forEach((item, i) => {

          const noProfileSettings = {
            name : "auto" + "_" + i,
          };

          vm.cmdService.group_createPlayer_noProfile({
            form: noProfileSettings,
          });

        });

        var autoWord;
        if(nb == 2) {
          autoWord = "teamsConfig";
        } else if(nb == 4) {
          autoWord = "instanceBegin";
        }

        if(autoWord) {
          vm.moveAuto("moveTo_c1",autoWord);
        } else {
          throw new Error("autoWord == null");
        }

      }

      vm.autoTeller = function(nb) {

        vm.cmdService.group_create();

        (new Array(nb)).fill(0).forEach((item, i) => {

          const noProfileSettings = {
            name : "autoTellerGroupPlayer" + "_" + i,
          };

          vm.cmdService.group_createPlayer_noProfile({
            form: noProfileSettings,
          });

        });

        var autoWord = "autoTeller" + "_" + nb;

        if(autoWord) {
          vm.moveAuto("moveTo_c1",autoWord);
        } else {
          throw new Error("autoWord == null");
        }

      }

      vm.autoGuesser = function(nb) {

        vm.cmdService.group_create();

        (new Array(nb)).fill(0).forEach((item, i) => {

          const noProfileSettings = {
            name : "autoGuesserGroupPlayer" + "_" + i,
          };

          vm.cmdService.group_createPlayer_noProfile({
            form: noProfileSettings,
          });

        });

        var autoWord = "autoGuesser" + "_" + nb;

        if(autoWord) {
          vm.moveAuto("moveTo_c1",autoWord);
        } else {
          throw new Error("autoWord == null");
        }

      }

      vm.autoDuo = function(name, destination) {

        vm.cmdService.group_create();

        (new Array(2)).fill(0).forEach((item, i) => {

          const noProfileSettings = {
            name : "autoDuo_" + destination + "_" + name + "_GroupPlayer" + "_" + i,
          };

          vm.cmdService.group_createPlayer_noProfile({
            form: noProfileSettings,
          });

        });

        // var autoWord = "autoDuo_" + name;
        var autoWord = "autoDuo_" + destination + "_" + name;
        console.log("autoWord", autoWord);

        if(autoWord) {
          vm.moveAuto("moveTo_c1",autoWord);
        } else {
          throw new Error("autoWord == null");
        }

      }

      vm.moveAuto = (commandName, autoWord) => {

        vm.moveToService.moveTo_c1({
          auto: {
            autoWord: autoWord,
          },
        });

      }



      function removePlayer(groupPlayer) {
        console.log("removePlayer");
        vm.cmdService.group_removePlayer({
          playerId : groupPlayer.id,
        });
      }

      function update(propName, value) {
        console.log("update", propName, value);
        if(propName == "name") {
          // vm.cmdService.group_set_name(value);
          vm.cmdService.group_set_name({
            name: value,
          });

        } else if(propName == "image") {
          // vm.cmdService.group_set_image_p(value)
          vm.cmdService.group_set_image_p({
            image: value,
          })
           // .then(success => {
           //   //reload ?
           // })
           // .catch(error => {
           //
           // })
           ;
        }
      }


  }

})();
