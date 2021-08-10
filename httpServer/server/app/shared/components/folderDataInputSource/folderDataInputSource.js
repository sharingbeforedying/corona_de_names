(function () {

  angular.module('awApp').component('folderDataInputSource', {
    templateUrl: 'app/shared/components/folderDataInputSource/folderDataInputSource.html',
    controller: FolderDataInputSourceController,
    bindings: {
      nbItems: "<",
      randomPick: "<",

      onNewInput: '&',
    }
  });

  FolderDataInputSourceController.$inject = [];
  function FolderDataInputSourceController() {
    console.log("FolderDataInputSourceController");
    var ctrl = this;

    //Browse...
    ctrl.input_folder = null;

    ctrl.processInput = processInput;

    /////////////

    function processInput(folder) {

      const files = folder.files;

      const arr_fileData_p = files.map(file => {
        return getFileData_p(file);
      });

      rxjs.forkJoin(arr_fileData_p).subscribe({
        next(arr_fileData) {
          ctrl.onNewInput({arr_data: arr_fileData});
        },
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

  }


})();
