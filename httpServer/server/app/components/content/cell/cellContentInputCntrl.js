angular.module("awApp").controller('cellContentInputController', function($scope) {
  console.log('cellContentInputController');

  $scope.init = function(contentUpdateCallback) {

    $scope.content = {
      image: "",
      word:  "",
    };

    $scope.contentDidUpdate = () => contentUpdateCallback($scope.content);

  };

  $scope.onDblClick = function() {
    console.log("onDblClick", "wordInput:", $scope.wordInput);
    $scope.wordInput.hidden = false;
    $scope.wordInput.focus();
    console.log("after:", $scope.wordInput);
  };

  $scope.wordInput_onBlur = function() {
    $scope.wordInput.hidden = true;
  }


  //word

  $scope.inputWordChanged = function() {
    console.log("inputWordChanged:", $scope.input_word);
    var newValue = $scope.input_word;

    // $scope.content.word = newValue;
    // $scope.contentDidUpdate();
  }

  $scope.submitInputWord = function(inputWord) {
    $scope.wordInput_onBlur();

    $scope.content.word = inputWord;
    $scope.contentDidUpdate();
  }




  //DND

  $scope.onItemsDrop = function(items) {
      console.log("onItemsDrop");
      console.log("items:", items);

      if(items[0].webkitGetAsEntry()) {
        console.log("A");
        $scope.onImagesDrop(items);
      } else {
        console.log("B");

      }

  };

  $scope.fetchImage = function(url) {
    return fetch(url)
            .then(res => res.blob()) // Gets the response and returns it as a blob
            .then(blob => URL.createObjectURL(blob));
  }

  $scope.onImageLinkDrop = function(items) {

    var url = items[0].getData("URL");
    console.log(url);

  }



  $scope.onImagesDrop = function(items) {

    var entry = items[0].webkitGetAsEntry();
    console.log(entry);
    if (entry.isFile) {
         // do whatever you want
         console.log("entry.isFile");

         $scope.convertImageFiles([entry])
               .then(urls => {
                 // $scope.cellModel.cellConfig.type    = "image";
                 $scope.content.image = urls[0];

                 $scope.contentDidUpdate();
               })

    } else if (entry.isDirectory) {
         // do whatever you want
         /*
         console.log("entry.isDirectory");
         $scope.getFilesInDir(entry)
                           .then(urls => {
                             console.log(urls);
                             //$scope.imageModels = urls;
                             //$scope.gameCreationModel.gridModel.cellModels = urls;
                             imageService.addImages(urls);
                             $scope.$apply();
                           });
         */
    }

  };

  $scope.getFilesInDir = function(entry) {
    var dirReader = entry.createReader();
    return new Promise((resolve, reject) => dirReader.readEntries(resolve, reject))
        .then(entries => entries.filter(entry => entry.isFile))
        .then(entries => $scope.convertImageFiles(entries))
  }

  $scope.convertImageFiles = function(entries) {
    return Promise.resolve(entries.map(entry => {entry.type="img/png"; return entry;}))
    .then(entries => entries.map(entry => new Promise((resolve,reject) => entry.file(resolve,reject))))
    .then(promises => Promise.all(promises))

    //warning : this is a bit ugly + need to handle all image types
    .then(files => files.map(file => new File([file], file.name, { type: "image/png" })))

    .then(files => files.map(file => new Promise((resolve, reject) => $scope.getFileUrl(file,resolve))))
    .then(promises => Promise.all(promises));
  }

  $scope.getFileUrl = function(file, url_callback) {
    console.log("getFileUrl", file);
    var reader = new FileReader();
           reader.onload = function(evt) {
               var file_url = evt.target.result; //<=> var file_url = reader.result;
               console.log("file_url:", file_url);
               url_callback(file_url);
           };
   reader.readAsDataURL(file);
 };

});
