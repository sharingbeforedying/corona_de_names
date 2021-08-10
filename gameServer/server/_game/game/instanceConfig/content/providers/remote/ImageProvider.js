const request     = require('request');
const querystring = require('querystring');

const deasync = require('deasync');

const defaultUrl = "http://localhost:2568/";
const defaultUrlMap = {
  randomImage :       defaultUrl + "randomImage",
  randomImage_array : defaultUrl + "randomImages",
  image : "",
  image_array : "",
}

class ImageProvider {

  constructor(urlMap = defaultUrlMap) {
    this.urlMap = urlMap;
  }

  urlForFunctionCall(functionName, paramsMap) {
    console.log("urlForFunctionCall", functionName, paramsMap);
    var url = this.urlMap[functionName];
    if(Object.keys(paramsMap).length > 0) {
      url += "?" + querystring.stringify(paramsMap);
    }
    return url;
  }

  /*
  p_getJsonAtUrl(url) {
    console.log("p_getJsonAtUrl", url);

    return new Promise((resolve, reject) => {
      request(url, function (error, response, body) {
          console.log("request, done", error, response.statusCode);
          if (!error && response.statusCode == 200) {
              // console.log(body);
              console.log(body.length);
              //resp(body);
              resolve([]);
          }
          else {
            console.log("error", error);
            reject({error: error, response: response});
          }
      });
    });
  }
  */

  a_getJsonAtUrl(url, cb) {
    request(url, function (error, response, body) {
        console.log("request, done");

        if (!error && response.statusCode == 200) {
            // console.log(body);
            //console.log(typeof(body));
            //console.log(body.length);

            // console.log(body.slice(0, 100));
            const json = JSON.parse(body);

            cb(null,json);
        }
        else {
          console.log("error", error);
          cb({error: error, response: response},null);
        }
    });
  }

  getJsonAtUrl(url) {
    console.log("getJsonAtUrl", url);

    /* conventional API signature : function(p1,...pn,function cb(error,result){})*/
    const asyncFunc = this.a_getJsonAtUrl;

    const syncFunc = deasync(asyncFunc);
    return syncFunc(url);
  }

  remoteCall(functionName, paramsMap) {
    console.log("remoteCall", functionName, paramsMap);

    const url = this.urlForFunctionCall(functionName, paramsMap);
    try {
      const json = this.getJsonAtUrl(url);
      return json;
    } catch(err) {
      console.log("remoteCall", "error", err);
      throw err;
    }

  }



  //INTERFACE

  randomImage() {
    return this.remoteCall("randomImage", {});
  }

  randomImage_array(nb_items) {
    console.log("randomImage_array", nb_items);

    const arr = this.remoteCall("randomImage_array", {nb_items : nb_items});
    if(arr) {
      console.log("randomImage_array, arr.length", arr.length);
    }

    return arr;
  }

  image(name) {
    return this.remoteCall("image", {name : name});
  }

  image_array(name, nb_items) {
    return this.remoteCall("image_array", {name : name, nb_items : nb_items});
  }

}

exports.ImageProvider = ImageProvider;
