(function () {

  angular.module("awApp").component('importSettings', {
      templateUrl: 'app/components/settings/importSettings/importSettings.html',
      controller: ImportSettingsController,
      // bindings: {
      //
      // }
  });

  ImportSettingsController.$inject = ['$scope', 'displaySettingsService'];
  function ImportSettingsController($scope, displaySettingsService) {
    console.log("ImportSettingsController");

      var vm = this;
      // vm.session = null;

      vm.$onInit = function() {
        console.log("ImportSettingsController", "$onInit");

        // manageIncomingEvents(vm, $scope);

        displaySettingsService.rx_displaySettings.subscribe({
          next(displaySettings) {
            vm.cell_size  = displaySettings.cell_size;
            vm.word_color = displaySettings.word_color;
            vm.word_size  = displaySettings.word_size;
          },
        });

        vm.updateWith_cellSize = function(cellSize) {
          console.log("updateWith_cellSize", cellSize);
          displaySettingsService.setCell_size(cellSize);
        };

        vm.updateWith_cellWidth = function(cellWidth) {
          console.log("updateWith_cellWidth", cellWidth);

          const cellSize = {
            width:  cellWidth,
            height: vm.cell_size.height,
          };
          displaySettingsService.setSize_cell(cellSize);

          // vm.size_cell = displaySettingsService.getSize_cell();
        };

        vm.updateWith_cellHeight = function(cellHeight) {
          console.log("updateWith_cellHeight", cellHeight);

          const cellSize = {
            width:  vm.cell_size.width,
            height: cellHeight,
          };
          displaySettingsService.setSize_cell(cellSize);

          // vm.size_cell = displaySettingsService.getSize_cell();
        };


        //word

        vm.updateWith_wordTextColor = function(textColor) {
          console.log("updateWith_wordTextColor", textColor);
          displaySettingsService.setWord_textColor(textColor);
        };

        vm.updateWith_wordBgColor = function(bgColor) {
          console.log("updateWith_wordBgColor", bgColor);
          displaySettingsService.setWord_bgColor(bgColor);
        };

        vm.updateWith_wordFontSize = function(fontSize) {
          console.log("updateWith_fontSize", fontSize);
          displaySettingsService.setWord_fontSize(fontSize);
        };
    };

  }

})();
