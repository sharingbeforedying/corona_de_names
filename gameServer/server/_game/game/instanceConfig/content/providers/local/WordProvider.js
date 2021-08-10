const fs      = require("fs");
// const fse     = require("fs-extra");

const path = require('path');

const ItemSource = require("./ItemSource.js").ItemSource;

const files = [
  path.join(__dirname, "la_liste_a_x.txt"),
  path.join(__dirname, "codenames_fr__raw.txt"),
];

class WordProvider {

  constructor() {
    this.itemSource = new ItemSource();

    this.fillItemSource(this.itemSource);
  }

  fillItemSource(itemSource) {

    // files.forEach((filePath, i) => {
    //   this.p_getFileData(filePath)
    //       .then(fileData => { //fileData is a Buffer
    //         // console.log("fileData", fileData);
    //         const str = fileData.toString();
    //         // console.log("str", str);
    //         const items = str.split("\n");
    //         // console.log("items.length", items.length);
    //         this.itemSource.addItems(items);
    //       });
    // });


    files.forEach((filePath, i) => {
      const fileData = fs.readFileSync(filePath);

      // console.log("fileData", fileData);
      const str = fileData.toString();
      // console.log("str", str);
      const items = str.split("\n");
      // console.log("items.length", items.length);
      this.itemSource.addItems(items);
    });


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
    });
  }



  //INTERFACE

  randomWord_array(nb_items) {
    console.log("randomWord_array", nb_items);
    return this.itemSource.getRandomItems(nb_items);
  }

}

exports.WordProvider = WordProvider;
