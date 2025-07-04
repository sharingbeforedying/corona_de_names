(function() {
  exports.GeminiTests = {};

  const mini = require("../../mini/Mini.js").Mini.mini;

  const sample       = require("../../Sample.js").sample;
  const combinations = require("../../Utils.js").Utils.combinations;

  function testLinkAB(obj1, obj2, fieldsFunc, equalsFunc) {

    function assert(condition, message) {
      if (!condition) {
          message = message || "Assertion failed";
          if (typeof Error !== "undefined") {
              throw new Error(message);
          }
          throw message; // Fallback
      }
    }

    function logObject(name, obj) {

      if(obj != null) {
        console.log(name, "{");

        for (var field in fieldsFunc(obj)) {
          const value = obj[field];
          if(value != null) {
            if (fieldsFunc(value) != null) {
                logObject(field, value);
            } else {
                console.log(field, value);
            }
          } else {
            console.log(field, "null");
          }
        }
        console.log("}");
      } else {
        console.log(name, "null");
      }
    }

    function myLog(...str) {
      console.log('\x1b[36m%s\x1b[0m', str);  //cyan
    }


    function testProp(obj1, obj2, propName) {

      const original = obj1[propName];

      myLog("--------BEGIN----------");

      //simple link
      obj2[propName] = sample(original);
      assert(equalsFunc(obj1, obj2), "error");
      myLog("obj2[propName] = sample(original);", "ok");

      obj1[propName] = sample(original);
      assert(equalsFunc(obj1, obj2), "error");
      myLog("obj1[propName] = sample(original);", "ok");



      //on/off
      obj1[propName] = null;
      assert(equalsFunc(obj1, obj2), "error");
      myLog("obj1[propName] = null;", "ok");


      obj1[propName] = sample(original);
      assert(equalsFunc(obj1, obj2), "error");
      myLog("obj1[propName] = sample(original);", "ok");



      obj2[propName] = null;

      logObject("obj1", obj1);
      logObject("obj2", obj2);

      assert(equalsFunc(obj1, obj2), "error");
      myLog("obj2[propName] = null;", "ok");


      obj2[propName] = sample(original);
      assert(equalsFunc(obj1, obj2), "error");
      myLog("obj2[propName] = sample(original);", "ok");

      myLog("--------END----------");

    }

    function getProp(obj, predicate) {
      const fields = fieldsFunc(obj);
      if(fields != null) {
        const fieldNamesArray = Object.keys(fields);
        const entries = fieldNamesArray.map(fieldName => [fieldName, obj[fieldName]]).filter(([fieldName, value]) => predicate(value));
        return entries.map(([fieldName, value]) => fieldName).find(e => true);
      } else {
        return null;
      }
    }

    function getFlatProp(obj) {
      return getProp(obj, (value) => fieldsFunc(value) == null);
    }

    function getDeepProp(obj) {
      return getProp(obj, (value) => fieldsFunc(value) != null);
    }

    function testLevel(obj1, obj2, level) {
      console.log("testLevel", level);

      const flatProp = getFlatProp(obj1);
      const deepProp = getDeepProp(obj1);

      if(flatProp != null) {
        testProp(obj1, obj2, flatProp);
      }
      if(deepProp != null) {
        testProp(obj1, obj2, deepProp);
        testLevel(obj1[deepProp], obj2[deepProp], level + 1);
      }

    }

    logObject("obj1", obj1);
    logObject("obj2", obj2);
    assert(equalsFunc(obj1, obj2), "error");

    testLevel(obj1, obj2, 0);

  }


  function testGeminiLinkGroup(objs, fieldsFunc, equalsFunc) {
    combinations(objs, 2).forEach(([obj1, obj2], i) => {
      testLinkAB(obj1, obj2, fieldsFunc, equalsFunc);
      testLinkAB(obj2, obj1, fieldsFunc, equalsFunc);
    });
  }






  function testGeminiLink(obj, geminiFunc, fieldsFunc, equalsFunc) {
    const target = obj;
    const gemini = geminiFunc(target);
    testGeminiLinkGroup([target, gemini], fieldsFunc, equalsFunc);
  }
  exports.GeminiTests.testLink = testGeminiLink;


})();
