
angular.module("awApp").controller('cncuMainController', function($scope, gameService) {
  console.log('cncuMainController');

  $scope.init = function() {
    console.log("cncuMainController::init");

    $scope.grid__content  = () => gameService.get_grid__content();

    $scope.child_models = () => {

      const content_cells  = $scope.grid__content().cells;

      const str_cellIndexes = Object.keys(content_cells)
      const numberSort = (a, b) => a - b;
      const cellIndexes = str_cellIndexes.map(s => parseInt(s)).sort(numberSort);
      return cellIndexes.map(cellIndex => {

        return {
          index:    cellIndex,

          content:  content_cells[cellIndex],
        };
      });

    };

    $scope.cellModels = $scope.child_models();

    gameService.onChange(() => {
      console.log("gameTellerPController::->gameService.onChange");
      $scope.cellModels = $scope.child_models();
      $scope.$apply();
    });


  };

  //callback curry
  $scope.manageCellContentInputForCellModel = function(cellModel) {
    return function(cellContent) {
      console.log("cncuMainController::manageCellContentInput", cellModel, cellContent);

      const cellIndex = cellModel.index;

      const word = cellContent.word;
      if(word) {
        gameService.sendToServer_word(cellIndex, word);
      }

      const image = cellContent.image;
      if(image) {
        gameService.sendToServer_image(cellIndex, image);
      }

    };
  };

  $scope.sendToServer_content_grid = function(content_grid) {
    gameService.sendToServer_content_grid(content_grid);
  }


  $scope.uploadFile = function(event){
      var files = event.target.files;
      console.log("files:", files);

      var file = files[0];

      $scope.getFileText_promise(file)
      .then(text => JSON.parse(text))
      .then(json => {
          var cells_obj = json["cells"];
          customImageService.configure(cells_obj);

          $scope.cncuGridModel.import_json(json);
          $scope.$apply();
      });

  };

  $scope.getFileText = function(file, callback) {
    console.log("getFileText", file);
    var reader = new FileReader();
           reader.onload = function(evt) {
               var file_text = evt.target.result; //<=> var file_url = reader.result;
               console.log("file_text:", file_text);
               callback(file_text);
           };
   reader.readAsText(file);
  }

  $scope.getFileText_promise = function(file) {
    return new Promise((response, reject) => {
      $scope.getFileText(file, response);
    });
  }

  $scope.save_grid_to_file = function() {
    var json = $scope.cncuGridModel.export_as_json();
    $scope.download(json, '', 'text/json');
  };

  $scope.download = function(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  };


});




angular.module("awApp").controller('cncuGridController', function($scope) {
    console.log('cncuGridController');

    $scope.init = function() {

    }

    $scope.styleForGrid = function() {
      return {
        "background-color" : "Transparent",

        //"pointer-events": "auto",
      };
    };

});

angular.module("awApp").controller('cncuCellController', function($scope) {
  console.log('cncuCellController');


  $scope.init = function(cellModel) {
    console.log("cncuCellController, init:", cellModel);
    $scope.cellModel = cellModel;

    $scope.word  = $scope.cellModel.content.content;

  };

});
