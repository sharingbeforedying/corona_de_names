const fs = require('fs');

class FileUtils {

  // function to encode file data to base64 encoded string
  static base64_encode(file) {
   // read binary data
   const bitmap = fs.readFileSync(file);
   // convert binary data to base64 encoded string
   return Buffer.from(bitmap).toString('base64');
  }

  // function to create file from base64 encoded string
  static base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
   const bitmap = Buffer.from(base64str, 'base64');
   // write buffer to file
   fs.writeFileSync(file, bitmap);
   console.log('******** File created from base64 encoded string ********');
  }

}

exports.FileUtils = FileUtils;
