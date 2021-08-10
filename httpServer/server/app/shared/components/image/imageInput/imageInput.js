(function () {

  angular.module('awApp').component('imageInput', {
    templateUrl: 'app/shared/components/image/imageInput/imageInput.html',
    controller: ImageInputController,
    bindings: {
      targetSize: "<",

      onSubmit: '&',
      onCancel: '&',
    }
  });

  function manageIncomingEvents(vm, $scope) {
    const fromEventPattern = rxjs.fromEventPattern;
    const tap = rxjs.operators.tap;

    fromEventPattern(
        (handler) => $scope.$on('cancel', handler)
    )
    .subscribe(
      evt  => {
        console.log('fromEventPattern', 'cancel', 'evt', evt);
      }
    );

    fromEventPattern(
        (handler) => $scope.$on('submit', handler)
    )
    .subscribe(
      evt  => {
        console.log('fromEventPattern', 'submit', 'evt', evt);
        vm.onSubmit({imgSrc: vm.imgSrc});
      }
    );
  }

  ImageInputController.$inject = ["$scope"];
  function ImageInputController($scope) {
    var ctrl = this;

    ctrl.$onInit = function() {
      console.log("ImageInputController", "$onInit");

      manageIncomingEvents(ctrl, $scope);
    };

    ctrl.imgSrc = null;
    ctrl.manageInput_data = manageInput_data;

    ////////////

    function manageInput_data(data) {
      const imgSrc = data;

      var pica_size__canvasTo;
      if(ctrl.targetSize) {
        pica_size__canvasTo = ctrl.targetSize;
      } else {
        const pica_size__canvasTo__default = {
          width:  300,
          height: 300,
        };
        pica_size__canvasTo = pica_size__canvasTo__default;
      }


      //resize image      //TODO: THIS 'KILLS' GIF AND WEBP ANIMATED IMAGES ---> respect mimeType
      compressImage_p__pica(imgSrc, pica_size__canvasTo)
      //   //debug
      // .then(blob => {
      //
      //   download(blob, "pica.png", "");
      //   // download(blob, "pica.png", "image/png");
      //
      //   return blob;
      // })
      //compress image    //WARNING: THIS 'KILLS' GIF AND WEBP ANIMATED IMAGES

      // .then(imgSrc_resized => imgSrcToBlob_p(imgSrc_resized))
      .then(blob => compressImage_p__compressor(blob))
      //   //debug
      // .then(blob => {
      //
      //   download(blob, "compressor.png", "");
      //   // download(blob, "compressor.png", "image/png");
      //
      //   return blob;
      // })

      .then(blob_c => getFileData_p(blob_c))
      .then(imgSrc_compressed => {
        ctrl.imgSrc = imgSrc_compressed;
        $scope.$apply();
      })

      // ctrl.imgSrc = imgSrc;
      // $scope.$apply();
    }

    function download (content, fileName, contentType) {
      var a = document.createElement("a");
      var file = new Blob([content], {type: contentType});
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
    };

    function imgSrcToBlob_p(imgSrc) {
      return fetch(imgSrc)
             .then(res => res.blob());
    }

    function createImage_p(imgSrc) {

      return new Promise((resolve, reject) => {
        const image = new Image();

        image.onload =  () => resolve(image);

        image.onerror = () => reject(new Error("image.onload errored"));
        image.onabort = () => reject(new Error("image.onload aborted"));

        image.src = imgSrc;
      });

    }

    // function compressImage_p__pica(imgSrc, size__canvasTo = {width: 100, height: 100}) {
    //   console.log("pica", pica);
    //   // const Pica = pica();
    //   const Pica = pica({ features: [ 'js', 'wasm', 'ww', 'cib' ] });
    //   console.log("Pica", Pica);
    //
    //
    //   return createImage_p(imgSrc)
    //   .then(img => {
    //
    //     const imgSize = {
    //       width:  img.width,
    //       height: img.height,
    //     };
    //     console.log("imgSize", imgSize);
    //
    //     //canvas__from
    //     const canvas__from = document.createElement('canvas');
    //     canvas__from.width  = imgSize.width;
    //     canvas__from.height = imgSize.height;
    //
    //     const ctx = canvas__from.getContext('2d');
    //     ctx.drawImage(img, 0, 0);
    //
    //     //canvas__to
    //     const canvas__to = document.createElement('canvas');
    //     canvas__to.width  = size__canvasTo.width;
    //     canvas__to.height = size__canvasTo.height;
    //
    //     return [canvas__from, canvas__to];
    //   })
    //   .then(([canvas__from, canvas__to]) => {
    //
    //     console.log("canvas__from", canvas__from);
    //     console.log("canvas__to", canvas__to);
    //
    //     return (Pica).resize(canvas__from, canvas__to, {
    //       unsharpAmount: 80,
    //       unsharpRadius: 0.6,
    //       unsharpThreshold: 2
    //     });
    //   })
    //   .then(canvas => {
    //     return (Pica).toBlob(canvas, 'image/jpeg', 0.90);
    //   });
    //
    //   //no need to remove child canvases because we haven't done document.body.appendChild(canvasX)
    //
    //   // .then(canvas => {
    //   //   console.log('resize done!', "canvas", canvas);
    //   //
    //   //   // document.getElementById("pica_canvasFrom").remove();
    //   //   // document.getElementById("pica_canvasTo").remove();
    //   //
    //   //   return (Pica).toBlob(canvas, 'image/jpeg', 0.90);
    //   // })
    //   // .catch(err => {
    //   //   console.log("err", err);
    //   //
    //   //   // document.getElementById("pica_canvasFrom").remove();
    //   //   // document.getElementById("pica_canvasTo").remove();
    //   // });
    //
    //   // const options = {
    //   //
    //   // };
    //   //
    //   // return Pica.resizeBuffer(options);
    //
    // }


    function compressImage_p__compressor(blob) {
      console.log("Compressor", Compressor);
      console.log("blob__input", blob);

      return new Promise((resolve, reject) => {
        new Compressor(blob, {
          // quality: 0.6,
          quality: 0.1,

          //convertSize: 5000000, //default: 5MB (PNG files over this value will be converted to JPEGs.)
          convertSize:   500000,
          success(result) {
            console.log("result", result);
            resolve(result);
          },
          error(err) {
            console.log(err.message);
            reject(err);
          },
        });
      });

    }

    /*
    //debug
    // .then(blob => {
    //   return compressImage_p__compressor(blob)
    //          .then(blob_output => {
    //            return {
    //              input: blob,
    //              output: blob_output,
    //            };
    //          });
    // })
    // .then(obj => {
    //   const ratio__size = obj.output.size / obj.input.size;
    //   console.log("ratio__size", ratio__size);
    //
    //   const blob_compressed = obj.output;
    //   console.log("blob_compressed", blob_compressed);
    //
    //   return obj.output;
    // })
    */

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

    // function imgSrcForFileData(fileData) {
    //   const base64Str = new Buffer.from(fileData).toString('base64');
    //   return "data:image/png;base64," + base64Str;
    // }


    // $scope.convertImageFiles = function(entries) {
    //   return Promise.resolve(entries.map(entry => {entry.type="img/png"; return entry;}))
    //   .then(entries => entries.map(entry => ))
    //   .then(promises => Promise.all(promises))
    //
    //   //warning : this is a bit ugly + need to handle all image types
    //   .then(files => files.map(file => new File([file], file.name, { type: "image/png" })))
    //
    //   .then(files => files.map(file => new Promise((resolve, reject) => $scope.getFileUrl(file,resolve))))
    //   .then(promises => Promise.all(promises));
    // }


  }

})();
