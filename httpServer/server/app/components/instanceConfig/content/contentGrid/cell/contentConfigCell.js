(function () {

  angular.module("awApp").component('contentConfigCell', {
      templateUrl: 'app/components/instanceConfig/content/contentGrid/cell/contentConfigCell.html',
      controller: ContentConfigCellController,
      bindings: {
        cellModel: '<',
        refreshTriggerCell : "<",

        onUpdate: '&',

        // cellCommander: "<",

      }
  });

  function manageIncomingEvents(vm, $scope) {
    const fromEventPattern = rxjs.fromEventPattern;
    const tap = rxjs.operators.tap;

    fromEventPattern(
        (handler) => $scope.$on('all_edit', handler)
    )
    .subscribe(
      evt  => {
        console.log('fromEventPattern', 'all_edit', 'evt', evt);
        $scope.$broadcast("edit");
      }
    );

    fromEventPattern(
        (handler) => $scope.$on('all_submit', handler)
    )
    .subscribe(
      evt  => {
        console.log('fromEventPattern', 'all_submit', 'evt', evt);
        $scope.$broadcast("submit");
      }
    );
  }

  function setupOutgoingEvents(vm, $scope) {

    vm.sendEvent = function(name) {

      if(name == "random_word") {
        const cellCommand = {
          cmd:       "random_word",
          cellModel: vm.cellModel,
        };
        $scope.$emit("cell_command", cellCommand);

      } else if(name == "random_image") {
        const cellCommand = {
          cmd:       "random_image",
          cellModel: vm.cellModel,
        };
        $scope.$emit("cell_command", cellCommand);

      }

    }
  }

  ContentConfigCellController.$inject = ['$scope'];
  function ContentConfigCellController($scope) {
    console.log("ContentConfigCellController");

      var vm = this;
      // vm.session = null;

      vm.$onInit = function() {
        console.log("ContentConfigCellController", "$onInit");

        manageIncomingEvents(vm, $scope);
        setupOutgoingEvents(vm, $scope);

        // vm.targetSize_cell = {
        //   width:  400,
        //   height: 400,
        // };
        vm.targetSize_cell = {
          width:  100,
          height: 100,
        };

        vm.contentCell = vm.cellModel.content;

        {
          const word = vm.contentCell.items[0].content;
          console.log("word", word);
          vm.word = word;

          const image = vm.contentCell.items[1].content;
          console.log("image", image);
          vm.image = image;

          if(vm.contentCell.items[2]) {
            const audio = vm.contentCell.items[2].content;
            // console.log("audio", audio);
            vm.audio = audio;
          }
        }

        vm.refreshTriggerCell.subscribe({
          next(x) {
            console.log('refreshTriggerCell', 'got value ' + x);
            const cellChange = x;
            console.log("cellChange.key", cellChange.key);
            console.log("cellChange.value", cellChange.value);

            if(cellChange.key == vm.cellModel.index) {

              const cellModel_new = cellChange.value;

              ///!\ WARNING /!\
              //ugly: do not update vm.contentCell for submit to make if as if something had changed
              // vm.contentCell = cellModel_new;

              const word = cellModel_new.items[0].content;
              console.log("word", word);
              vm.word = word;

              const image = cellModel_new.items[1].content;
              console.log("image", image);
              vm.image = image;

              if(cellModel_new.items[2]) {
                const audio = cellModel_new.items[2].content;
                // console.log("audio", audio);
                vm.audio = audio;
              }

              $scope.$apply();
            }

          },
          error(err) { console.error('refreshTriggerCell', 'something wrong occurred: ' + err); },
          complete() { console.log('refreshTriggerCell', 'done'); }
        });

        // vm.cellModel.cellCommander.rx_edit.subscribe({
        //   next(x) {
        //     console.log('rx_allEdit', 'got value ' + x);
        //
        //   }
        // });

      };

      vm.update = function(prop, value) {
        console.log("ContentConfigCellController", "update", prop);

        var somethingHasChanged = false;

        //TODO: check if there really was a change
        if(prop == "word") {
          const prev = vm.contentCell.items[0].content;
          const newv = value;
          console.log("prev", prev);
          console.log("newv", newv);

          if(newv != prev) {
            vm.contentCell.items[0].content = value;
            somethingHasChanged = true;
          }

        } else if(prop == "image") {
          vm.contentCell.items[1].content = value;
          somethingHasChanged = true;
        } else if(prop == "audio") {

          if(!vm.contentCell.items[2]) {
            vm.contentCell.items[2] = {
              type:2,
              content:null,
            };
          }

          vm.contentCell.items[2].content = value;
          somethingHasChanged = true;

        }

        if(somethingHasChanged) {
          const cellUpdate = {
            prop:prop,
            cellModel:vm.cellModel,
          };

          vm.onUpdate({cellUpdate : cellUpdate});
        }

      }

      vm.edit_cancel = function() {
        console.log("edit_cancel");
      }

      //////////////////

      vm.random_word = function() {
        console.log("random_word");
        vm.sendEvent("random_word");
      }

      vm.random_image = function() {
        console.log("random_image");
        vm.sendEvent("random_image");
      }

  }

})();
