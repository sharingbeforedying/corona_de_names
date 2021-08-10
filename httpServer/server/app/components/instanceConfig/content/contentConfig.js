(function () {

  angular.module("awApp").component('contentConfig', {
      templateUrl: 'app/components/instanceConfig/content/contentConfig.html',
      controller: ContentConfigController,
      bindings: {
        roomService: '<',
      }
  });

  // import Pica from 'pica';
  // const pica = Pica();
  // pica.resize(img, canvas).then(...);

  function manageIncomingEvents(vm, $scope) {
    const fromEventPattern = rxjs.fromEventPattern;
    const tap = rxjs.operators.tap;

    fromEventPattern(
        (handler) => $scope.$on('cell_command', handler)
    )
    .subscribe(
        data  => {
          console.log('fromEventPattern', 'cell_command', 'data', data);
          const cell_command = data[1];

          console.log("cell_command", cell_command);
          vm.contentCellCommand(cell_command);

        }
    );
  }

  ContentConfigController.$inject = ['$scope', 'displaySettingsService'];
  function ContentConfigController($scope, displaySettingsService) {
      var vm = this;
      // vm.session = null;

      vm.submitContentConfig  = submitContentConfig;

      vm.$onInit = function() {

        manageIncomingEvents(vm, $scope);

        vm.bg = {};
        vm.bg.bgColor = "#777715";

        //quality
          //ok
        vm.bg.targetSize = {
          width:  1500,
          height: 1500,
        };
        vm.targetSize_cell = {
          width:  300,
          height: 300,
        };
          //low
        // vm.bg.targetSize = {
        //   width:  400,
        //   height: 400,
        // };
        // vm.targetSize_cell = {
        //   width:  100,
        //   height: 100,
        // };

        vm.nbItems = 25;
        vm.folderImage_randomPick = true;

        const state = vm.roomService.room.state;

        vm.commandService = vm.roomService.commandService;

        const contentConfig = state.contentConfig;
        console.log("contentConfig", contentConfig);

        console.log("rxjs", rxjs);
        const Rx = rxjs;

        vm.refreshTrigger     = new Rx.Subject();
        vm.refreshTriggerCell = new Rx.Subject();

        //in

        vm.contentConfig = contentConfig;
        vm.grid_content  = contentConfig.grid;

        vm.rx_contentConfig__load = new Rx.Subject();
        const rx_contentConfig__united = Rx.merge(vm.roomService.rx_contentConfig, vm.rx_contentConfig__load);

        // vm.roomService.rx_contentConfig
        rx_contentConfig__united
        .pipe(rxjs.operators.skip(1))
        .subscribe({
          next(x) { console.log('rx_contentConfig', 'got value ' + x);
            const contentConfig = x;
            console.log("contentConfig", contentConfig);

            //hard reset
            vm.contentConfig = null;
            vm.grid_content  = null;
            $scope.$apply();


            vm.contentConfig = contentConfig;
            vm.grid_content  = contentConfig.grid;
            $scope.$apply();

            const grid_content = contentConfig.grid;
            $scope.$broadcast("grid_content", grid_content);

            vm.refreshTrigger.next(grid_content);
          },
          error(err) { console.error('rx_contentConfig', 'something wrong occurred: ' + err); },
          complete() { console.log('rx_contentConfig', 'done'); }
        });

        vm.roomService.rx_cell_change.subscribe({
          next(x) { console.log('rx_cell_change', 'got value ' + x);
            const cell_change = x;

            vm.refreshTriggerCell.next(cell_change);
          },
          error(err) { console.error('rx_cell_change', 'something wrong occurred: ' + err); },
          complete() { console.log('rx_cell_change', 'done'); }
        });


        displaySettingsService.rx_displaySettings.subscribe({
          next(displaySettings) {
            // console.log("displaySettingsService.rx_displaySettings", "next", displaySettings);
            const cell_size = displaySettings.cell_size;
            $scope.$broadcast("cell_size", cell_size);

            const word_color = displaySettings.word_color;
            const word_size  = displaySettings.word_size;
            $scope.$broadcast("word_color", word_color);
            $scope.$broadcast("word_size", word_size);

          },
        });



        (function initalizeCanvases() {
          const canvas_bg_from__id = 'canvas_bg_from';
          const canvas_bg_from = new fabric.Canvas(canvas_bg_from__id, { selection: false });
          vm.canvas_bg_from = canvas_bg_from;

          //debug
          // canvas.add(new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100 }));
          // canvas.selectionColor = 'rgba(0,255,0,0.3)';
          // canvas.selectionBorderColor = 'red';
          // canvas.selectionLineWidth = 5;
          //
          // canvas.add(new fabric.Circle({ radius: 70, fill: '#5f5', top: 100, left: 100 }));
          // canvas.selectionColor = 'rgba(0,255,0,0.3)';
          // canvas.selectionBorderColor = 'red';
          // canvas.selectionLineWidth = 5;

          const canvas_bg_to__id = 'canvas_bg_to';
          const canvas_bg_to = new fabric.Canvas(canvas_bg_to__id, { selection: false });
          vm.canvas_bg_to = canvas_bg_to;
        })();


        ///out

        vm.update = function(prop, value) {
          console.log("update", prop, value);

          if(prop == "name") {
            const prev = vm.contentConfig.name;
            const newv = value;
            // console.log("prev", prev);
            // console.log("newv", newv);
            const somethingHasChanged = (newv != prev);

            if(somethingHasChanged) {
              const name = value;
              vm.contentConfig.name = name;
              vm.roomService.commandService.instance_config_contentConfig_mutate_set_name({
                name: name,
              });
            }

          }
        }

        vm.updateWith_BgBgColor = function(bgColor) {
          // vm.bg.bgColor
        }



        vm.input_bulk = function(prop, value) {
          if(prop == "background-image") {

            const bgImage = value;

            vm.size_kb__bg = sizeForImgSrc(bgImage);

            //fill canvas with bg image
            const canvas = vm.canvas_bg_from;
            // canvas.add(new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100 }));
            // const fabricImage = fabric.Image.from
            // canvas.im
            fabric.Image.fromURL(bgImage, function(oImg) {

              // oImg.set({
              //   width:  vm.bg.targetSize.width,
              //   height: vm.bg.targetSize.height,
              // });



              const rect_background = new fabric.Rect({
                width:  oImg.width,
                height: oImg.height,
                fill: vm.bg.bgColor,
              });

              const group = new fabric.Group([rect_background, oImg], {});
              canvas.add(group);

              // oImg.set({
              //   fill: 'rgba(0,100,0,1)',
              // });

              //add original bg image
              // oImg.width = 500;
              // oImg.height = 500;
              // canvas.add(oImg);

              //create/add clones
              // const object = oImg;
              // object.clone(function(clone) {
              //
              // 									    canvas.add(clone.set({
              // 									        left: object.left + 10,
              // 									        top: object.top + 10
              // 									    }));
              // 									});

              // slice(oImg, 5, 5);
              // gridFrom(oImg, 5, 5, function(grid) {
              gridFrom(group, 5, 5, function(grid) {
                canvas.add(grid);
              });

            });

            function gridFrom(fabricObject, nb_rows, nb_cols, cb) {
              //create container
              const group = new fabric.Group([], {
                width: fabricObject.width,
                height: fabricObject.height,
                // fill:"#223344",
              });

              //create/add cells
              var cells = {};

              const itemSize = {
                width:  fabricObject.width  / nb_cols,
                height: fabricObject.height / nb_rows,
              };

              const nb_items = nb_rows * nb_cols;
              const source = rxjs.range(0, nb_items);

              const cellAsObservableFunc = rxjs.bindCallback(cellAtIndex);

              const allCellsObservable = source
                .pipe(rxjs.operators.mergeMap(index => {
                        const cellAsObservable     = cellAsObservableFunc(fabricObject, nb_rows, nb_cols, itemSize, index);
                        return cellAsObservable;
                      }),
                      rxjs.operators.toArray()
                );

              allCellsObservable.subscribe({
                next(arr) {
                  console.log("allCellsObservable", "next", "arr", arr);

                  arr.forEach((cell, index) => {
                    cells[index] = cell;

                    console.log("group.add", index);
                    // group.add(cell);
                    group.addWithUpdate(cell);

                    // if index == 13, remove cell
                    // if(index == 13) {
                    //   console.log("group.remove", index);
                    //   group.remove(cell);
                    // }

                    const cellModel = {
                      index: index,

                      content: vm.contentConfig.grid.cells[index],
                    };
                    const imgSrc = cell.getSrc();


                    //this is ugly

                    cellModel.content.items[1].content = imgSrc;

                    // const cellUpdate = {
                    //   prop: "image",
                    //   cellModel: cellModel,
                    // }
                    // vm.contentCellUpdate(cellUpdate);

                    const cell_change = {
                      key:   index,
                      value: cellModel.content,
                    };

                    vm.refreshTriggerCell.next(cell_change);

                  });

                  cb(group);

                }
              });

            }

            function cellAtIndex(fabricObject, nb_rows, nb_cols, itemSize, index, cb) {
              const y = index;
              const x = nb_cols;
              const quotient = Math.floor(y/x);
              const remainder = y % x;

              const i = quotient;
              const j = remainder;

              cellAtIJ(fabricObject, nb_rows, nb_cols, itemSize, i, j, cb);
            }


            function cellAtIJ(fabricObject, nb_rows, nb_cols, itemSize, i, j, cb) {
              console.log("cellAtIJ", i, j);

              const imgSrc = fabricObject.toDataURL({
                  left: j * itemSize.width,
                  top:  i * itemSize.height,
                  width: itemSize.width,
                  height: itemSize.height,
              });

              fabric.Image.fromURL(imgSrc, function(oImg2) {

                const offset_base = {
                  left: 0,
                  // top: 500,
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

                oImg2.set({
						        left: fabricObject.left + offset.left,
						        top:  fabricObject.top  + offset.top,
						    });
                // vm.canvas.add(oImg2);

                cb(oImg2);
              });
            }


          }

        }

        function sizeForImgSrc(imgSrc) {
          const buffer = bufferForDataURL(imgSrc);
          const blob = new Blob([buffer]);

          const size_bytes = blob.size;
          const size_kb    = size_bytes / 1000;

          return size_kb;
        }



        vm.export_grid_as_img = function() {

          const canvas = vm.canvas_bg_to;

          const contentCells = Object.values(vm.grid_content.cells);
          const imgSrcs      = contentCells.map(contentCell => contentCell.items[1].content);

          const nb_rows = 5;
          const nb_cols = 5;
          const itemSize = {
            width:  300,
            height: 300,
          };

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

          const arr_oImgObservable = imgSrcs.map((imgSrc, index) => {

            const coords = gridCoords(index, nb_cols);
            const i = coords.i;
            const j = coords.j;

            const imageAsObservableFunc = rxjs.bindCallback(fabric.Image.fromURL);
            const imageAsObservable     = imageAsObservableFunc(imgSrc);

            return imageAsObservable
                   .pipe(
                     rxjs.operators.map(oImg => {
                     // rxjs.operators.mergeMap(oImg => {

                       // const targetSize = {
                       //   width: itemSize.width,
                       //   height: itemSize.height
                       // };

                       // const targetSize = {
                       //   width:  200,
                       //   height: 200,
                       // };

                       const scaleX = itemSize.width  / oImg.width;
                       const scaleY = itemSize.height / oImg.height;

                       return oImg.set({
                            scaleX: scaleX,
                            scaleY: scaleY,
                        });

                       // return oImg.set({
                       //   width:  targetSize.width,
                       //   height: targetSize.height,
                       // });

                       // const cloneAsObservableFunc = rxjs.bindCallback(oImg.clone.bind(oImg));
                       // const cloneAsObservable     = cloneAsObservableFunc();
                       //
                       // return cloneAsObservable.pipe(
                       //   rxjs.operators.map(oImgClone => {
                       //     // console.log("oImgClone1", oImgClone);
                       //     return oImgClone.set({
                       //       width:  targetSize.width,
                       //       height: targetSize.height,
                       //     });
                       //   }),
                       //   rxjs.operators.mergeMap(oImgClone => {
                       //     // console.log("oImgClone2", oImgClone);
                       //     const Pica = pica({ features: [ 'js', 'wasm', 'ww', 'cib' ] });
                       //     return (Pica).resize(oImg, oImgClone, {
                       //       unsharpAmount: 80,
                       //       unsharpRadius: 0.6,
                       //       unsharpThreshold: 2
                       //     });
                       //   })
                       // );


                       // const imgSrc = oImg.toDataURL();
                       //
                       // const blob_resized_p   = compressImage_p__pica(imgSrc, targetSize);
                       //
                       // return blob_resized_p
                       //        .then(blob_resized => {
                       //          console.log("blob_resized", blob_resized);
                       //        })
                       //        .then(blob_resized => {
                       //          // return getFileData_p(blob_resized);
                       //
                       //          const urlCreator     = window.URL || window.webkitURL;
                       //          const imgSrc_resized = urlCreator.createObjectURL( blob_resized );
                       //          return imgSrc_resized;
                       //        })
                       //        .then(imgSrc_resized => {
                       //
                       //          console.log("imgSrc_resized", imgSrc_resized);
                       //
                       //          const oImg_resized   =  fabric.Image.fromURL(imgSrc_resized);
                       //          console.log("oImg_resized", oImg_resized);
                       //
                       //          return oImg_resized;
                       //        });

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

          allImageAsObservables.subscribe({
            next(arr_oImg) {
              console.log(arr_oImg);

              arr_oImg.forEach((oImg, i) => {
                group.addWithUpdate(oImg);
              });

              const gridSrc = group.toDataURL();
              // const gridSrc = group.toDataURL('image/png');
              // console.log("gridSrc", gridSrc);

              //save to file
              // const filename = "background.png";
              const filename = vm.contentConfig.name ? vm.contentConfig.name : '';
              vm.saveImageSrc(gridSrc, filename);

            },
            error(e) {
              console.error(e);
            },
            complete() {
             console.log('This is how it ends!');
            },
          });

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



        }

        vm.export_grid_as_img_seams = function() {

          const canvas = vm.canvas_bg_to;

          const contentCells = Object.values(vm.grid_content.cells);
          const imgSrcs      = contentCells.map(contentCell => contentCell.items[1].content);

          const nb_rows = 5;
          const nb_cols = 5;
          const itemSize = {
            width:  300,
            height: 300,
          };

          const margin = 25;

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

          const arr_oImgObservable = imgSrcs.map((imgSrc, index) => {

            const coords = gridCoords(index, nb_cols);
            const i = coords.i;
            const j = coords.j;

            const imageAsObservableFunc = rxjs.bindCallback(fabric.Image.fromURL);
            const imageAsObservable     = imageAsObservableFunc(imgSrc);

            return imageAsObservable
                   .pipe(
                     rxjs.operators.map(oImg => {

                       const targetSize = {
                         width: itemSize.width   - 2 * margin,
                         height: itemSize.height - 2 * margin,
                       };

                       const scaleX = targetSize.width  / oImg.width;
                       const scaleY = targetSize.height / oImg.height;

                       return oImg.set({
                            scaleX: scaleX,
                            scaleY: scaleY,
                        });

                       // return oImg.set({
                       //   width:  targetSize.width,
                       //   height: targetSize.height,
                       // });

                       // const cloneAsObservableFunc = rxjs.bindCallback(oImg.clone.bind(oImg));
                       // const cloneAsObservable     = cloneAsObservableFunc();
                       //
                       // return cloneAsObservable.pipe(
                       //   rxjs.operators.map(oImgClone => {
                       //     // console.log("oImgClone1", oImgClone);
                       //     return oImgClone.set({
                       //       width:  targetSize.width,
                       //       height: targetSize.height,
                       //     });
                       //   }),
                       //   rxjs.operators.mergeMap(oImgClone => {
                       //     // console.log("oImgClone2", oImgClone);
                       //     const Pica = pica({ features: [ 'js', 'wasm', 'ww', 'cib' ] });
                       //     return (Pica).resize(oImg, oImgClone, {
                       //       unsharpAmount: 80,
                       //       unsharpRadius: 0.6,
                       //       unsharpThreshold: 2
                       //     });
                       //   })
                       // );


                       // const imgSrc = oImg.toDataURL();
                       //
                       // const blob_resized_p   = compressImage_p__pica(imgSrc, targetSize);
                       //
                       // return blob_resized_p
                       //        .then(blob_resized => {
                       //          console.log("blob_resized", blob_resized);
                       //        })
                       //        .then(blob_resized => {
                       //          // return getFileData_p(blob_resized);
                       //
                       //          const urlCreator     = window.URL || window.webkitURL;
                       //          const imgSrc_resized = urlCreator.createObjectURL( blob_resized );
                       //          return imgSrc_resized;
                       //        })
                       //        .then(imgSrc_resized => {
                       //
                       //          console.log("imgSrc_resized", imgSrc_resized);
                       //
                       //          const oImg_resized   =  fabric.Image.fromURL(imgSrc_resized);
                       //          console.log("oImg_resized", oImg_resized);
                       //
                       //          return oImg_resized;
                       //        });

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

                       const offset_margin = {
                         left: margin,
                         top:  margin,
                       };

                       const offset = {
                         left: offset_base.left + offset_cell.left + offset_margin.left,
                         top:  offset_base.top  + offset_cell.top  + offset_margin.top,
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

          allImageAsObservables.subscribe({
            next(arr_oImg) {
              console.log(arr_oImg);

              arr_oImg.forEach((oImg, i) => {
                group.addWithUpdate(oImg);
              });

              const gridSrc = group.toDataURL();
              // const gridSrc = group.toDataURL('image/png');
              // console.log("gridSrc", gridSrc);

              //save to file
              // const filename = "background.png";
              const filename = vm.contentConfig.name ? vm.contentConfig.name : '';
              vm.saveImageSrc(gridSrc, filename);

            },
            error(e) {
              console.error(e);
            },
            complete() {
             console.log('This is how it ends!');
            },
          });

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



        }

        vm.export_grid_as_zip = function() {

          const filename = vm.contentConfig.name ? vm.contentConfig.name : "contentGrid";

          const contentCells = Object.values(vm.grid_content.cells);
          const imgSrcs      = contentCells.map(contentCell => contentCell.items[1].content);

          vm.saveImageSrcsAsZip(imgSrcs, filename);
        }



        vm.edit_cancel = function() {
          console.log("edit cancel");
        }

        vm.contentCellUpdate = function(cellUpdate) {

          console.log("contentCellUpdate", cellUpdate);
          const prop      = cellUpdate.prop;
          const cellModel = cellUpdate.cellModel;

          const index       = cellModel.index;
          const contentCell = cellModel.content;

          if(prop == "word") {
            const word = contentCell.items[0].content;
            vm.roomService.commandService.instance_config_content_contentCell_mutate_set_word({
              index: index,
              word: word,
            });
          } else if(prop == "image") {
            const image = contentCell.items[1].content;
            vm.roomService.commandService.instance_config_content_contentCell_mutate_set_image({
              index: index,
              image: image,
            });
          } else if(prop == "audio") {
            const audio = contentCell.items[2].content;
            vm.roomService.commandService.instance_config_content_contentCell_mutate_set_audio({
              index: index,
              audio: audio,
            });
          }

        }


        vm.contentConfigWholeUpdate = function(contentConfig) {
          console.log("contentConfigWholeUpdate", contentConfig);
          vm.roomService.commandService.instance_config_content_contentConfig_mutate_whole({
            contentConfig: contentConfig,
          });
        }



        vm.contentCellCommand = function(cellCommand) {

          console.log("contentCellCommand", cellCommand);
          const command   = cellCommand.cmd;
          const cellModel = cellCommand.cellModel;

          const index       = cellModel.index;
          // const contentCell = cellModel.content;

          if(command == "random_word") {
            vm.roomService.commandService.instance_config_content_contentCell_random_word({
              index: index,
            });
          } else if(command == "random_image") {
            vm.roomService.commandService.instance_config_content_contentCell_random_image({
              index: index,
            });
          }

        }

      };

      vm.$onDestroy = function() {
        console.log("vm.$onDestroy");

      }

      //////////////////

      function submitContentConfig() {
        vm.commandService.instance_config_content_submitContentConfig();
      };



      //upload

      vm.uploadFile = function(event){
          var files = event.target.files;
          console.log("files:", files);

          var file = files[0];

          vm.getFileText_promise(file)
          .then(text => JSON.parse(text))
          .then(json => {
              // var cells_obj = json["cells"];
              // customImageService.configure(cells_obj);
              // vm.cncuGridModel.import_json(json);
              //$scope.$apply();

              const contentConfig = json;
              vm.rx_contentConfig__load.next(contentConfig);

              vm.contentConfigWholeUpdate(contentConfig);
          });

      };

      vm.getFileText = function(file, callback) {
        console.log("getFileText", file);
        var reader = new FileReader();
               reader.onload = function(evt) {
                   var file_text = evt.target.result; //<=> var file_url = reader.result;
                   console.log("file_text:", file_text);
                   callback(file_text);
               };
       reader.readAsText(file);
      }

      vm.getFileText_promise = function(file) {
        return new Promise((response, reject) => {
          vm.getFileText(file, response);
        });
      }


        //csv
      vm.uploadFile__csv = function(event){
          var files = event.target.files;
          console.log("files:", files);

          var file = files[0];

          vm.getFileText_promise(file)
          // .then(text => JSON.parse(text))
          .then(csvString => {
              console.log("Papa parse", "input:", csvString);
              var obj = Papa.parse(csvString);
              console.log("Papa parse", "output:", obj);
              const allWords = obj.data.flat();


              const contentConfig = vm.contentConfig;

              allWords.forEach((word, index) => {
                // const cell = contentConfig.grid.cells[i];
                // cell.items[0].content = word;
                // vm.rx_contentConfig__load.next(contentConfig);
                // vm.contentConfigWholeUpdate(contentConfig);

                vm.roomService.commandService.instance_config_content_contentCell_mutate_set_word({
                  index: index,
                  word: word,
                });
              });

          });

      };


      vm.uploadTemplateFile = function(event) {
        var files = event.target.files;
        console.log("files:", files);

        var file = files[0];

        vm.getFileText_promise(file)
        .then(text => JSON.parse(text))
        .then(json => {
            // var cells_obj = json["cells"];
            // customImageService.configure(cells_obj);
            // vm.cncuGridModel.import_json(json);
            //$scope.$apply();

            const contentConfig = json;
            vm.rx_contentConfig_template__load.next(contentConfig);
        });

      }


      //save

      vm.save_to_file = function() {
        // var json = $scope.cncuGridModel.export_as_json();
        const json = JSON.stringify(vm.contentConfig);
        vm.download(json, '', 'text/json');
      };

      vm.download = function(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
      };


      vm.saveImageSrc = function(imgSrc, filename) {
        const buffer = bufferForDataURL(imgSrc);
        vm.download(buffer, filename, 'image/png');
      }

      function dataStringForDataURL(dataURL) {
        console.log("dataStringForDataURL");
        // const dataString = dataURL.substring( "data:image/png;base64,".length );

        // const regex = /[A-Z]/g;
        // const found = paragraph.match(regex);

        const inputString = dataURL;
        const regex1 = RegExp('data;image/*;base64,', 'g');

        const arr = regex1.exec(inputString);
        const index = regex1.lastIndex;
        console.log("index", index);

        const dataString = dataURL.substring(index);

        return dataString;
      }

      function bufferForDataURL(dataURL) {

        const dataString = dataStringForDataURL(dataURL);

        const data = atob( dataString );
        const asArray = new Uint8Array(data.length);

        for( var i = 0, len = data.length; i < len; ++i ) {
          asArray[i] = data.charCodeAt(i);
        }

        return asArray.buffer;
      }

      vm.saveImageSrcsAsZip = function(imgSrcs, filename) {

        console.log("JSZip", JSZip);

        const zip = new JSZip();
        // zip.file("Hello.txt", "Hello World\n");
        // var img = zip.folder("images");
        // img.file("smile.gif", imgData, {base64: true});

        imgSrcs.forEach((imgSrc, i) => {
          const buffer = bufferForDataURL(imgSrc);
          // zip.file("" + i + ".png", buffer, {base64: false});
          zip.file("" + i + ".png", buffer, {base64: true});
        });

        zip.generateAsync({type:"blob"}).then(function(content) {
            // see FileSaver.js
            // saveAs(content, "example.zip");
            vm.download(content, filename + ".zip", "application/zip");
        });

      }


      vm.all_edit = function() {
        // vm.gridCommander.rx_all_edit.next("");
        $scope.$broadcast("all_edit", "edit");

        vm.isAllEdit = true;
        // $scope.$apply();
      };
      vm.all_submit = function() {
        // vm.gridCommander.rx_all_submit.next("");
        $scope.$broadcast("all_submit", "submit");

        vm.isAllEdit = false;
        // $scope.$apply();
      };


      vm.shuffleGrid = function() {
        vm.roomService.commandService.instance_config_content_contentGrid_shuffle({});
      }

      vm.random_words = function() {
        vm.roomService.commandService.instance_config_content_contentGrid_random_words({});
      }

      vm.random_images = function() {
        vm.roomService.commandService.instance_config_content_contentGrid_random_images({});
      }

  }

})();
