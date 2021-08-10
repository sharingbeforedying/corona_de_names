angular.module("awApp").controller('cellContentController', function($scope, displaySettingsService) {
  console.log('cellContentController');

  $scope.init = function(cellItems) {
    $scope.items = cellItems;

    $scope.word  = $scope.items[contentItemType.WORD].content;
    $scope.image = $scope.items[contentItemType.IMAGE].content;

  };

  $scope.styleForCard = function() {
    return {
      // "width"  : "" + $scope.displaySettings.cell_size + "px",
      "height" : "" + displaySettingsService.getSize_cell() + "px",
    };
  };

  $scope.styleForWord = function() {
    return {
      "font-size": "" + displaySettingsService.getSize_font() + "px",
    };
  };

});
