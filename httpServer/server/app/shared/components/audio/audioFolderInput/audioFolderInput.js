(function () {

  angular.module('awApp').component('audioFolderInput', {
    templateUrl: 'app/shared/components/audio/audioFolderInput/audioFolderInput.html',
    controller: AudioFolderInputController,
    bindings: {
      nbItems:  "<",
      itemSize: "<",
      randomPick: "<",

      onSubmit: '&',
      onCancel: '&',
    },
    //this does not exist => do it in $onInit()
    // resolve: {
    //   itemSize: () => {
    //     console.log("imageFolderInput", "resolve binding", itemSize);
    //     return Object.create({width: 300, height: 300});
    //   }
    // }
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

  AudioFolderInputController.$inject = ["$scope"];
  function AudioFolderInputController($scope) {
    var ctrl = this;

    ctrl.$onInit = function() {
      console.log("AudioFolderInputController", "$onInit");

      manageIncomingEvents(ctrl, $scope);

      const canvas_bg_to__id = 'canvas_bg_to';
      const canvas_bg_to = new fabric.Canvas(canvas_bg_to__id, { selection: false });
      ctrl.canvas_bg_to = canvas_bg_to;

      //manage null bindings
      if(ctrl.itemSize == null) {
        ctrl.itemSize = Object.create({width: 300, height: 300});
      }

    };

    ctrl.imgSrc = null;
    ctrl.manageInput_data = manageInput_data;

    // if(ctrl.nbItems && ctrl.itemSize) {
    //   ctrl.targetSize = {
    //     width:  1500,
    //     height: 1500,
    //   };
    // }

    ////////////

    function manageInput_data(arr_data) {
      console.log("manageInput_data", "arr_data", arr_data);

      // var arr_data__filtered;
      // if(ctrl.nbItems) {
      //   arr_data__filtered = arr_data.slice(0, ctrl.nbItems);
      // } else {
      //   arr_data__filtered = arr_data;
      // }

      const arr_imgSrc_p = arr_data.map(cell_imgSrcFromRawFileData_p);
      // const arr_imgSrc_p = arr_data__filtered.map(cell_imgSrcFromRawFileData_p);

      const allAsObservable = rxjs.forkJoin(arr_imgSrc_p);

      const gridImgSrcAsObservable = allAsObservable.pipe(rxjs.operators.mergeMap(arr_imgSrc => {
        return create_gridImgSrc_p(arr_imgSrc);
      }));

      gridImgSrcAsObservable.subscribe({
        next(gridImgSrc) {
          ctrl.imgSrc = gridImgSrc;
          $scope.$apply();
        },
      });

    }

    function cell_imgSrcFromRawFileData_p(rawFileData) {
      const imgSrc = rawFileData;

      // var pica_size__canvasTo;
      // if(ctrl.itemSize) {
      //   pica_size__canvasTo = ctrl.itemSize;
      // } else {
      //   const pica_size__canvasTo__default = {
      //     width:  300,
      //     height: 300,
      //   };
      //   pica_size__canvasTo = pica_size__canvasTo__default;
      // }
      // console.log("pica_size__canvasTo", pica_size__canvasTo);
      const pica_size__canvasTo = ctrl.itemSize;

      return compressImage_p__pica(imgSrc, pica_size__canvasTo)
      .then(blob => compressImage_p__compressor(blob))
      .then(blob_c => getFileData_p(blob_c));
    }

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

    function create_gridImgSrc_p(arr_imgSrc) {

      const canvas = ctrl.canvas_bg_to;

      const nb_rows = 5;
      const nb_cols = 5;
      // const itemSize = {
      //   width:  300,
      //   height: 300,
      // };
      const itemSize = ctrl.itemSize;

      const gridSize = {
        width:  nb_cols * itemSize.width,
        height: nb_rows * itemSize.height,
      };

      //create container
      const group = new fabric.Group([], {
        width:  gridSize.width,
        height: gridSize.height,
        // fill:"#654321",
      });

      canvas.add(group);

      const fabricObject = group;

      function gridCoords(index, nb_cols) {
        const y = index;
        const x = nb_cols;
        const quotient = Math.floor(y/x);
        const remainder = y % x;

        const i = quotient;
        const j = remainder;

        const coords = {
          i:i,
          j:j,
        };

        return coords;
      }

      const arr_oImgObservable = arr_imgSrc.map((imgSrc, index) => {

        const coords = gridCoords(index, nb_cols);
        const i = coords.i;
        const j = coords.j;

        const imageAsObservableFunc = rxjs.bindCallback(fabric.Image.fromURL);
        const imageAsObservable     = imageAsObservableFunc(imgSrc);

        return imageAsObservable
               .pipe(
                 rxjs.operators.map(oImg => {

                   const scaleX = itemSize.width  / oImg.width;
                   const scaleY = itemSize.height / oImg.height;

                   return oImg.set({
                        scaleX: scaleX,
                        scaleY: scaleY,
                    });

                 }),
                 rxjs.operators.map(oImg => {

                   const offset_base = {
                     left: 0,
                     top: 0,
                   };

                   const offset_cell = {
                     left: j * itemSize.width,
                     top:  i * itemSize.height,
                   };

                   const offset = {
                     left: offset_base.left + offset_cell.left,
                     top:  offset_base.top  + offset_cell.top,
                   };

                   oImg.set({
                       left: fabricObject.left + offset.left,
                       top:  fabricObject.top  + offset.top,
                   });

                   return oImg;
               })
              );

      });

      console.log("arr_oImgObservable", arr_oImgObservable);

      // const buffered = arr_oImgObservable.pipe(bufferCount(25));
      const allImageAsObservables = rxjs.forkJoin(arr_oImgObservable);

      const gridImgSrcAsObservable = allImageAsObservables.pipe(rxjs.operators.map(arr_oImg => {
        arr_oImg.forEach((oImg, i) => {
          group.addWithUpdate(oImg);
        });

        const gridImgSrc = group.toDataURL();

        return gridImgSrc;
      }));

      return gridImgSrcAsObservable;

    }


  }

})();
