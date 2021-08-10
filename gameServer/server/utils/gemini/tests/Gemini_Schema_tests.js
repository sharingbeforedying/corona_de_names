(function() {
  exports.Gemini_Schema_tests = {};

  const Gemini_tests  = require("./Gemini_tests.js").Gemini_tests;

  const Gemini_Schema = require("../Gemini_Schema.js").Gemini_Schema;
  const fieldsFunc    = Gemini_Schema.fieldsFunc;

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
  exports.Gemini_Schema_tests.equalsFunc = equalsFunc;

  exports.Gemini_Schema_tests.Gemini = {};
  function testGemini_Schema(target) {

    // const gemini = Gemini_Schema.createGemini(target);
    // console.log("target", JSON.stringify(target));
    // console.log("gemini", JSON.stringify(gemini));
    const createGemini = Gemini_Schema.createGemini;
    console.log("createGemini", createGemini);
    const gemini = createGemini(target);
    console.log("gemini", gemini);

    try {
      Gemini_tests.Gemini.testLink(target, createGemini, fieldsFunc, equalsFunc);
      console.log("testGemini_Schema", "Gemini", "testLink", "success");
    } catch(error) {
      console.log("testGemini_Schema", "Gemini", "testLink", "failed", error);
    }

    try {
      Gemini_tests.Gemini.testChain(target, createGemini, fieldsFunc, equalsFunc);
      console.log("testGemini_Schema", "Gemini", "testChain", "success");
    } catch(error) {
      console.log("testGemini_Schema", "Gemini", "testChain", "failed", error);
    }

    try {
      Gemini_tests.Gemini.testStar(target, createGemini, fieldsFunc, equalsFunc);
      console.log("testGemini_Schema", "Gemini", "testStar", "success");
    } catch(error) {
      console.log("testGemini_Schema", "Gemini", "testStar", "failed", error);
    }

  }
  exports.Gemini_Schema_tests.Gemini.test = testGemini_Schema;

  function testGemini_Schema_mini(target, miniSel) {

    const createMiniGemini = Gemini_Schema.createMiniGemini;
    const createGemini     = (target) => createMiniGemini(target, miniSel);

    const mini   = require("../../mini/Mini.js").Mini.mini;
    const equalsFunc_mini = (obj1, obj2) => createGemini(mini(obj1, miniSel), mini(obj2, miniSel));

    try {
      Gemini_tests.Gemini.testLink(target, createGemini, fieldsFunc, equalsFunc_mini);
      console.log("testGemini_Schema", "testLink_mini", "success");
    } catch(error) {
      console.log("testGemini_Schema", "testLink_mini", "failed", error);
    }

    try {
      Gemini_tests.Gemini.testChain(target, createGemini, fieldsFunc, equalsFunc_mini);
      console.log("testGemini_Schema", "testChain_mini", "success");
    } catch(error) {
      console.log("testGemini_Schema", "testChain_mini", "failed", error);
    }

    try {
      Gemini_tests.Gemini.testStar(target, createGemini, fieldsFunc, equalsFunc_mini);
      console.log("testGemini_Schema", "testStar_mini", "success");
    } catch(error) {
      console.log("testGemini_Schema", "testStar_mini", "failed", error);
    }
  }
  exports.Gemini_Schema_tests.Gemini.test_mini = testGemini_Schema_mini;





  exports.Gemini_Schema_tests.Echo = {};
  function testEcho_Schema(target) {

    const createEcho = Gemini_Schema.createEcho;

    try {
      Gemini_tests.Echo.testLink(target, createEcho, fieldsFunc, equalsFunc);
      console.log("testGemini_Schema", "Echo", "testLink", "success");
    } catch(error) {
      console.log("testGemini_Schema", "Echo", "testLink", "failed", error);
    }

    try {
      Gemini_tests.Echo.testChain(target, createEcho, fieldsFunc, equalsFunc);
      console.log("testGemini_Schema", "Echo", "testChain", "success");
    } catch(error) {
      console.log("testGemini_Schema", "Echo", "testChain", "failed", error);
    }

    try {
      Gemini_tests.Echo.testStar(target, createEcho, fieldsFunc, equalsFunc);
      console.log("testGemini_Schema", "Echo", "testStar", "success");
    } catch(error) {
      console.log("testGemini_Schema", "Echo", "testStar", "failed", error);
    }

  }
  exports.Gemini_Schema_tests.Echo.test = testEcho_Schema;

  function testEcho_Schema_mini(target, miniSel) {

    const createMiniEcho = Gemini_Schema.createMiniEcho;
    const createEcho     = (target) => createMiniEcho(target, miniSel);

    const mini   = require("../../mini/Mini.js").Mini.mini;
    const equalsFunc_mini = (obj1, obj2) => createGemini(mini(obj1, miniSel), mini(obj2, miniSel));

    try {
      Gemini_tests.Echo.testLink(target, createEcho, fieldsFunc, equalsFunc_mini);
      console.log("testGemini_Schema", "testLink_mini", "success");
    } catch(error) {
      console.log("testGemini_Schema", "testLink_mini", "failed", error);
    }

    try {
      Gemini_tests.Echo.testChain(target, createEcho, fieldsFunc, equalsFunc_mini);
      console.log("testGemini_Schema", "testChain_mini", "success");
    } catch(error) {
      console.log("testGemini_Schema", "testChain_mini", "failed", error);
    }

    try {
      Gemini_tests.Echo.testStar(target, createEcho, fieldsFunc, equalsFunc_mini);
      console.log("testGemini_Schema", "testStar_mini", "success");
    } catch(error) {
      console.log("testGemini_Schema", "testStar_mini", "failed", error);
    }
  }
  exports.Gemini_Schema_tests.Echo.test_mini = testEcho_Schema_mini;





})();
