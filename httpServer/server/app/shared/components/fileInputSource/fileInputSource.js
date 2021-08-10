(function () {

angular.module('awApp').component('fileInputSource', {
  templateUrl: 'app/shared/components/fileInputSource/fileInputSource.html',
  controller: FileInputSourceController,
  bindings: {
    onNewInput: '&',
  }
});

FileInputSourceController.$inject = [];
function FileInputSourceController() {
  console.log("FileInputSourceController");
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

  ctrl.onItemsDrop = function(dataTransfer) {

      const dataTransferItemsList = dataTransfer.items;

      console.log("onItemsDrop");
      console.log("dataTransferItemsList:");
      Object.values(dataTransferItemsList).forEach((dataTransferItem, i) => {
        console.log("dataTransferItem", dataTransferItem);
      });


      const item = dataTransferItemsList[0];
      const entry = item.webkitGetAsEntry();
      if(entry) {
        processEntry(entry);
      } else {
        console.log("non-entry item", item);
        // const file = item.getAsFile();
        // console.log("file", file);

        const url= dataTransfer.getData('text/plain');
        console.log("url", url);

        function validateResponse(res) {

          console.log("res", res);

          const valid = true;

          if(!valid) {
            throw new Error("res is invalid");
          }

          return res;
        }

        fetch(url, {
          // mode: 'same-origin',
          // mode: 'cors',
          // mode: 'no-cors',
        })
        .then(validateResponse)
        .then(res  => res.blob())
        .then(blob => {

          console.log("blob", blob);

          // const uri      = new Uri(url);
          // const filename = uri.Segments[uri.Segments.Length - 3];
          // console.log("filename", filename);
          const filename = "lolilol";

          const d = new Date();
          const t = d.getTime();

          const file = new File([blob], filename, {lastModified: t});
          return file;
        })
        .then(file => {
          ctrl.onNewInput({file: file});
        })
        .catch(function(error) {
          console.log('Looks like there was a problem: \n', error);
        });

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
