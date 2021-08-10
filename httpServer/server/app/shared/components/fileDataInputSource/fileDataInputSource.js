(function () {

angular.module('awApp').component('fileDataInputSource', {
  templateUrl: 'app/shared/components/fileDataInputSource/fileDataInputSource.html',
  controller: FileDataInputSourceController,
  bindings: {
    onNewInput: '&',
  }
});

FileDataInputSourceController.$inject = [];
function FileDataInputSourceController() {
  console.log("FileDataInputSourceController");
  var ctrl = this;

  //Browse...
  ctrl.input_file = null;

  ctrl.processInput = processInput;

  /////////////

  function processInput(file) {
    getFileData_p(file)
    .then(data => {
      ctrl.onNewInput({data: data});
    })
    .catch(error => {
      console.log("manageEntry", "error", file, error);
    });
  }

  function getFileData_p(file) {
    console.log("getFileData_p", file);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function(evt) {
         const file_url = evt.target.result; //<=> var file_url = reader.result;
         console.log("file_url:", file_url);
         resolve(file_url);
      };
      reader.readAsDataURL(file);
    });

  }


  // ////link drop
  //
  // function fetchImage(url) {
  //   return fetch(url)
  //           .then(res => res.blob()) // Gets the response and returns it as a blob
  //           .then(blob => URL.createObjectURL(blob));
  // }
  //
  // function onImageLinkDrop(items) {
  //
  //   var url = items[0].getData("URL");
  //   console.log(url);
  //
  // }
  }


// angular.module('awApp').component('dataInputSource', {
//   templateUrl: 'app/shared/components/dataInputSource/dataInputSource.html',
//   controller: DataInputSourceController,
//   bindings: {
//     onNewInput: '&',
//   }
// });
//
// DataInputSourceController.$inject = [];
// function DataInputSourceController() {
//   console.log("DataInputSourceController");
//   var ctrl = this;
// }


})();
