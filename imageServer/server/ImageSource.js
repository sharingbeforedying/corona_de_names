const glob    = require('glob');
const fs      = require("fs");
const fse     = require("fs-extra");
const path    = require('path');

const NodeCache = require('node-cache');

const ItemSource = require('./ItemSource.js').ItemSource;

// const images_folder = "J:/content/IMAGES_IMAGES/____sel/mouais photos";
const images_folder = "J:/content/IMAGES_IMAGES/____sel/";


class ImageSource {

  //CACHE ENGINE
  constructor() {
    this.cache = new NodeCache();
  }

  p_getFromCache(key) {
    return new Promise((resolve, reject) => {
      const cached = this.cache.get(key);
      if(cached) {
        resolve(cached);
      } else {
        const error = new Error("Key not found:" + key);
        reject(error);
      }
    });
  }

  p_getUsingCache(key, pg_make) {
    return this.p_getFromCache(key)
                      .catch(err => pg_make()         //pg = promise generator
                                    .then(made => {   //this is a disguised 'promise.tap'
                                      this.cache.set(key, made);
                                      return made;
                                    })
                      );

  };



  //GET DATA

  p_getImageFilepaths_make(srcDir, ext) {
    return new Promise((resolve, reject) => {
      glob(srcDir + '/**/*.' + ext, function(err, res) {
        if(err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  p_getImageFilepaths(srcDir, ext) {
      const key     = "" + srcDir + "__" + ext;
      //pg = promise generator
      const pg_make = () => this.p_getImageFilepaths_make(srcDir, ext);
      return this.p_getUsingCache(key, pg_make);
  }




  //PROCESSING

  p_randomImages(count) {
    return this.p_getImageFilepaths(images_folder, "*")
           .then(imagePaths => {

              const itemSource = new ItemSource();
              itemSource.addItems(imagePaths);

              return itemSource;
           })
           .then(itemSource => itemSource.getRandomItems(count))
           //.then(imagePaths => imagePaths.map(imagePath => getImageData(imagePath)));
  }

  p_getFileData(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, function(err,data){
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
      });
    })
  }

  p_getImageUrlData(imagePath) {
    return this.p_getFileData(imagePath)
           // .then(fileData => new Buffer.from(fileData).toString('base64'))
           //fileData is already a buffer
           .then(fileData => fileData.toString('base64'))
           .then(base64Str => "data:image/png;base64," + base64Str);
  }





  p_get_json() {
    // return p_randomImages(25)
    //        .then(imagePaths => {return {imagePaths: imagePaths};});
    return this.p_randomImages(25)
           .then(imagePaths => Promise.all(imagePaths.map(imagePath => this.p_getImageUrlData(imagePath))))
           .then(imageSrcs => {return {imageSrcs: imageSrcs};});
  }






  // p_get_randomImageUrlData() {
  //   return this.p_get_randomImageUrlData_array(1)
  //              .then(json => {
  //                find(e => true);
  // }

  p_get_randomImageUrlData_array(nb_items) {
    return this.p_randomImages(nb_items)
           .then(imagePaths => Promise.all(imagePaths.map(imagePath => this.p_getImageUrlData(imagePath))));
  }


}

//exports
module.exports.ImageSource = ImageSource;



//test
var myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);
var mode     = myArgs[0];

const imageSource = new ImageSource();

if(mode == "test") {

  //test_itemSource();

  //test_getImages();
  test_getImages2();

}

function test_itemSource() {
  const itemSource = new ItemSource();
  console.log(itemSource);
  itemSource.addItems([...Array(100).keys()]);
  console.log(itemSource);
  console.log(itemSource.getRandomItems(25));
}

function test_getImages() {
  imageSource.p_getImages(images_folder, "png")
  .then(imagePaths => {console.log(imagePaths); return "";})
}

function test_getImages2() {
  imageSource.p_randomImages(25)
  .then(imagePaths => {console.log(imagePaths); return "";})
}
