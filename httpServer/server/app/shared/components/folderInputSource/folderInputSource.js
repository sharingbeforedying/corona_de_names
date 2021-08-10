(function () {

angular.module('awApp').component('folderInputSource', {
  templateUrl: 'app/shared/components/folderInputSource/folderInputSource.html',
  controller: FolderInputSourceController,
  bindings: {
    nbItems: "<",
    randomPick: "<",

    onNewInput: '&',
  }
});

FolderInputSourceController.$inject = [];
function FolderInputSourceController() {
  console.log("FolderInputSourceController");
  var ctrl = this;

  //Browse...
  ctrl.input_file = null;

  ctrl.processInput = function(event) {

      // console.log("event", event);
      // console.log("event.target", event.target);

      const fileList  = event.target.files;
      console.log("fileList:", fileList);
      // function compare_filename(fa, fb) {
      //   const filename_fa = fa.name;
      //   const filename_fb = fb.name;
      //
      //   const string_a = filename_fa;
      //   const string_b = filename_fb;
      //
      //   const comp = string_a.localeCompare(string_b);
      //   return comp;
      // }

      // const collator = new Intl.Collator(undefined, {numeric: true});
      // const compare_filename = collator.compare;

      function compare_filename(fa, fb) {
        const filename_fa = fa.name;
        const filename_fb = fb.name;

        console.log("filename_fa", filename_fa);
        console.log("filename_fb", filename_fb);


        var comp;

        const string_a = filename_fa.split(".").find(e=>true);
        const string_b = filename_fb.split(".").find(e=>true);

        const int_a = parseInt(string_a, 10);
        const int_b = parseInt(string_b, 10);

        const isNumber_a = !Number.isNaN(int_a);
        const isNumber_b = !Number.isNaN(int_b);

        if(isNumber_a && isNumber_b) {
          comp = int_a - int_b;
        } else {
          comp = string_a.localeCompare(string_b);
        }
        return comp;
      }

      const arr_files = Array.from(fileList)
                        .sort(compare_filename);

      var arr_files__filtered;
      if(ctrl.nbItems) {
        if(ctrl.randomPick) {
          //take random items: _shuffle_ then take first items
          var arr_files__shuffled = arr_files.slice();  //create shallow copy

          function shuffle(a) {
              var j, x, i;
              for (i = a.length - 1; i > 0; i--) {
                  j = Math.floor(Math.random() * (i + 1));
                  x = a[i];
                  a[i] = a[j];
                  a[j] = x;
              }
              return a;
          }

          arr_files__shuffled = shuffle(arr_files__shuffled);

          arr_files__filtered = arr_files__shuffled.slice(0, ctrl.nbItems);

        } else {
          //take first items
          arr_files__filtered = arr_files.slice(0, ctrl.nbItems);
        }
      } else {
        arr_files__filtered = arr_files;
      }


      function retrieveFoldername(arr_files) {
        var foldername = "";

        if(arr_files.length > 0 ) {
          var relativePath = arr_files[0].webkitRelativePath;
          var pathComponents = relativePath.split("/");
          foldername = pathComponents[0];
        }

        return foldername;
      }

      const foldername = retrieveFoldername(arr_files);

      const folder = {
        name:  foldername,
        files: arr_files__filtered,
      };
      ctrl.onNewInput({folder: folder});
  };

  ctrl.onDblClick = function(){
      console.log("onDblClick");
  };

  //DND

  ctrl.onItemsDrop = function(dataTransfer) {
      console.log("onItemsDrop", dataTransfer);

      const dataTransferItemsList = dataTransfer.items;
      console.log("dataTransferItemsList:");
      Object.values(dataTransferItemsList).forEach((dataTransferItem, i) => {
        console.log("dataTransferItem", dataTransferItem);
      });

      if(dataTransferItemsList.length == 1) {
        const item = dataTransferItemsList[0];

        const entry = item.webkitGetAsEntry();

        const isFolder = !entry.isFile;
        console.log("isFolder", isFolder);

        if(isFolder) {
          const file = item.getAsFile();
          console.log("file", file);



        } else {
          console.log("item is file => ignore");
        }

      } else {
        console.log("many objects (> 1) were dropped => ignore");
      }

      // const fileList = dataTransfer.files;
      // console.log("fileList", fileList);
      //
      // if(fileList.length == 1) {
      //   const f = fileList[0];
      //
      //   const isFolder = !f.type && f.size%4096 == 0;
      //
      //   console.log("isFolder", isFolder);
      //   console.log("f", f);
      //
      //
      //
      // } else {
      //   console.log("many objects (> 1) were dropped => ignore");
      // }



      // const item = dataTransferItemsList[0];
      // const entry = item.webkitGetAsEntry();
      // if(entry) {
      //   processEntry(entry);
      // } else {
      //   console.log("non-entry item", item);
      //   // const file = item.getAsFile();
      //   // console.log("file", file);
      //
      //   const url= dataTransfer.getData('text/plain');
      //   console.log("url", url);
      //
      //   function validateResponse(res) {
      //
      //     console.log("res", res);
      //
      //     const valid = true;
      //
      //     if(!valid) {
      //       throw new Error("res is invalid");
      //     }
      //
      //     return res;
      //   }
      //
      //   fetch(url, {
      //     // mode: 'same-origin',
      //     // mode: 'cors',
      //     // mode: 'no-cors',
      //   })
      //   .then(validateResponse)
      //   .then(res  => res.blob())
      //   .then(blob => {
      //
      //     console.log("blob", blob);
      //
      //     // const uri      = new Uri(url);
      //     // const filename = uri.Segments[uri.Segments.Length - 3];
      //     // console.log("filename", filename);
      //     const filename = "lolilol";
      //
      //     const d = new Date();
      //     const t = d.getTime();
      //
      //     const file = new File([blob], filename, {lastModified: t});
      //     return file;
      //   })
      //   .then(file => {
      //     ctrl.onNewInput({file: file});
      //   })
      //   .catch(function(error) {
      //     console.log('Looks like there was a problem: \n', error);
      //   });
      //
      // }
  };

  ////////////

   function processEntry(entry) {

    return new Promise((resolve,reject) => entry.file(resolve,reject))
           .then(file => {
             ctrl.onNewInput({file: file});
           });

  }




}

})();
