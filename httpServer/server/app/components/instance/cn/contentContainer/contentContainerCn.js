(function () {

  angular.module("awApp").component('contentContainerCn', {
      templateUrl: 'app/components/instance/cn/contentContainer/contentContainerCn.html',
      controller: ContentContainerController,

      bindings: {
        content: "<",
      },
  });

  function manageIncomingEvents(vm, $scope) {
    const fromEventPattern = rxjs.fromEventPattern;

    fromEventPattern(
        (handler) => $scope.$on('word_color', handler)
    )
    .subscribe(
        data  => {
          console.log('fromEventPattern', 'word_color', 'data', data);
          const word_color = data[1];
          // vm.word_color = word_color;

          vm.styleForWord["color"]            = word_color.textColor;
          vm.styleForWord["background-color"] = word_color.bgColor;
        }
    );

    fromEventPattern(
        (handler) => $scope.$on('word_size', handler)
    )
    .subscribe(
        data  => {
          console.log('fromEventPattern', 'word_size', 'data', data);
          const word_size = data[1];
          // vm.word_size = word_size;

          vm.styleForWord["font-size"]        = word_size.fontSize;
        }
    );

  }

  ContentContainerController.$inject = ['$scope', "displaySettingsService"];
  function ContentContainerController($scope, displaySettingsService) {
      var vm = this;
      // vm.localId = "";
      // vm.connect = () => serverService.connect();

      console.log("ContentContainerController");
      manageIncomingEvents(vm, $scope);


      vm.$onInit = function() {
        console.log("ContentContainerController::$onInit");


        const word = vm.content.items[0].content;
        console.log("word", word);
        vm.word = word;

        const imageItem = vm.content.items[1];
        if(imageItem) {
          const image = imageItem.content;
          vm.image = image;
        }

      }




      vm.styleForCell = function() {
        var outStyle = {};

        return outStyle;
      };

      vm.styleForCard = function() {
        return {
          // "width"  : "" + $scope.displaySettings.cell_size + "px",
          // "height" : "" + displaySettingsService.getSize_cell() + "px",
        };
      };

      vm.styleForWord = {};


  }

})();
