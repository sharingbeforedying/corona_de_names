(function() {
  exports.Gemini_Object_tests = {};

  const Gemini_tests  = require("./Gemini_tests.js").Gemini_tests;

  const Gemini_Object = require("../Gemini_Object.js").Gemini_Object;
  const fieldsFunc    = Gemini_Object.fieldsFunc;

  function equalsFunc(obj1, obj2) {
    var same = true;

    const schema1 = fieldsFunc(obj1);
    const schema2 = fieldsFunc(obj2);

    const schema1_length = Object.keys(schema1).length;
    const schema2_length = Object.keys(schema2).length;

    if(schema1_length == schema2_length) {
      for (var field in schema1) {
        const type1  = schema1[field];
        const value1 = obj1[field];

        const type2  = schema2[field];
        const value2 = obj2[field];

        const sameType  = (type1 == type2)
        if(!sameType) {
          same = false;
          console.log(field, "different type:", type1, "vs", type2);
          break;
        }

        var sameValue;
        if(value1 != null && value2 != null) {
          if(fieldsFunc(value1) != null) {
            sameValue = equalsFunc(value1,value2);
          } else {
            sameValue = value1 == value2;
          }
        } else {
          sameValue = value1 == value2;
        }
        if(!sameValue) {
          same = false;
          console.log(field , "different value:", value1, "vs", value2);
          break;
        }
      }
    } else {
      console.log("different lengths:", schema1_length, "vs", schema2_length);
      same = false;
    }

    return same;
  }
  exports.Gemini_Object_tests.equalsFunc = equalsFunc;


  function testGemini_Object(target) {

    // const gemini = Gemini_Object.createGemini(target);
    // console.log("target", JSON.stringify(target));
    // console.log("gemini", JSON.stringify(gemini));
    const createGemini = Gemini_Object.createGemini;
    try {
      Gemini_tests.testLink(target, createGemini, fieldsFunc, equalsFunc);
      console.log("testGemini_Object", "testLink", "success");
    } catch(error) {
      console.log("testGemini_Object", "testLink", "failed", error);
    }

    try {
      Gemini_tests.testChain(target, createGemini, fieldsFunc, equalsFunc);
      console.log("testGemini_Object", "testChain", "success");
    } catch(error) {
      console.log("testGemini_Object", "testChain", "failed", error);
    }

    try {
      Gemini_tests.testStar(target, createGemini, fieldsFunc, equalsFunc);
      console.log("testGemini_Object", "testStar", "success");
    } catch(error) {
      console.log("testGemini_Object", "testStar", "failed", error);
    }

  }
  exports.Gemini_Object_tests.test = testGemini_Object;


  function testGemini_Object_mini(target, miniSel) {

    const createGemini = Gemini_Object.createGemini;
    const createGemini_mini = (obj) => createGemini(obj, false, miniSel);

    const mini   = require("../../mini/Mini.js").Mini.mini;
    const equalsFunc_mini = (obj1, obj2) => createGemini(mini(obj1, miniSel), mini(obj2, miniSel));

    try {
      Gemini_tests.testLink(target, createGemini_mini, fieldsFunc, equalsFunc_mini);
      console.log("testGemini_Object", "testLink_mini", "success");
    } catch(error) {
      console.log("testGemini_Object", "testLink_mini", "failed", error);
    }

    try {
      Gemini_tests.testChain(target, createGemini_mini, fieldsFunc, equalsFunc_mini);
      console.log("testGemini_Object", "testChain_mini", "success");
    } catch(error) {
      console.log("testGemini_Object", "testChain_mini", "failed", error);
    }

    try {
      Gemini_tests.testStar(target, createGemini_mini, fieldsFunc, equalsFunc_mini);
      console.log("testGemini_Object", "testStar_mini", "success");
    } catch(error) {
      console.log("testGemini_Object", "testStar_mini", "failed", error);
    }
  }
  exports.Gemini_Object_tests.test_mini = testGemini_Object_mini;


})();
