(function () {

angular.module('awApp').component('exoInputSource', {
  templateUrl: 'app/shared/components/exoInputSource/exoInputSource.html',
  controller: ExoInputSourceController,
  bindings: {
    onNewInput: '&',
  }
});

ExoInputSourceController.$inject = [];
function ExoInputSourceController() {
  console.log("ExoInputSourceController");
  var ctrl = this;

  //Browse...
  ctrl.input_file = null;

  ctrl.processInput = function(event){
      const fileList = event.target.files;
      console.log("fileList:", fileList);

      const file = fileList[0];
      ctrl.onNewInput({file: file});
  };

  ctrl.onDblClick = function(){
      console.log("onDblClick");
  };

  //DND

  ctrl.onItemsDrop = function(dataTransferItemsList) {
      console.log("onItemsDrop");
      console.log("dataTransferItemsList:", dataTransferItemsList);

      const item = dataTransferItemsList[0];
      const entry = item.webkitGetAsEntry();
      if(entry) {
        processEntry(entry);
      } else {
        console.log("non-entry item", item);
      }
  };

  ////////////

   function processEntry(entry) {

    return new Promise((resolve,reject) => entry.file(resolve,reject))
    .then(file => {
      ctrl.onNewInput({file: file});
    });

  }

  ////link drop

  function fetchImage(url) {
    return fetch(url)
            .then(res => res.blob()) // Gets the response and returns it as a blob
            .then(blob => URL.createObjectURL(blob));
  }

  function onImageLinkDrop(items) {

    var url = items[0].getData("URL");
    console.log(url);

  }




}

})();
