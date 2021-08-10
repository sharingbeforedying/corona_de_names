(function() {
  exports.Computed_Schema = {};

  const Computed = require("./Computed.js").Computed;
  const registerComputed = Computed.registerComputed;
  const FieldFormula     = Computed.FieldFormula;

  const schema    = require('@colyseus/schema');
  const Schema    = schema.Schema;

  function registerComputed_Schema(obj, fieldFormulas) {
    const changeFunc = obj.$changes.change.bind(obj.$changes);
    const changeFuncSetter = (changeFunc) => {obj.$changes.change = changeFunc.bind(obj.$changes);};

    registerComputed(obj, changeFunc, changeFuncSetter, fieldFormulas);
  }

  exports.Computed_Schema.registerComputed = registerComputed_Schema;
  exports.Computed_Schema.FieldFormula     = FieldFormula;




  //create computed

  const Gemini          = require("../gemini/Gemini.js").Gemini;
  const FieldDefinition = Gemini.FieldDefinition;

  const createEcho = require("../gemini/Gemini_Schema.js").Gemini_Schema.createEcho;

  function subArray(arr, start, end) {
    if (!end) { end = -1; }
    return arr.slice(start, arr.length + 1 - (end * -1));
  }

  function fieldsTree(fieldPathArrays) {
    console.log("fieldsTree", fieldPathArrays);

    const merged = fieldPathArrays.reduce((acc, fieldPathArray) => {
      if(fieldPathArray.length > 1) {
        const first = fieldPathArray[0];
        if(!acc[first]){
          acc[first] = [];
        }
        const rest = subArray(fieldPathArray, 1);
        console.log("rest", rest);
        acc[first].push(rest);
      } else if(fieldPathArray.length == 1) {
        const first = fieldPathArray[0];
        acc[first] = [];
      } else {
        console.log("fieldPathArray.length == 0");
      }
      return acc;
    }, {});
    console.log("merged", merged);

    const tree = Object.entries(merged).reduce((acc, [fieldName, fieldPathArray]) => {
      Object.assign(acc, {[fieldName] : fieldsTree(fieldPathArray)});
      return acc;
    }, {});

    console.log("tree", tree);

    return tree;
  }

  function createFieldDefinitions(source, fieldPaths) {

    const fieldPathArrays = fieldPaths.map(fieldPath => fieldPath.pathArray);
    const fieldsTree      = fieldsTree(fieldPathArrays);

    Object.entries(fields).map(([fieldName, fieldType]) => {
      var geminiFieldType;
      if(fieldType instanceof dstClass) {
        const fieldDefs   = fieldDefsForTarget(dstClass, target, isEcho, fieldTypesSetter, fieldsFunc);
        const geminiClass = createGeminiClass(dstClass, target, isEcho, fieldTypesSetter, fieldDefs);
        geminiFieldType = geminiClass;
      } else {
        geminiFieldType = fieldType;
      }
      return [fieldName, new FieldDefinition(fieldName, geminiFieldType, isEcho)];
    })

  }

  const Gemini_Schema = require("../gemini/Gemini_Schema.js").Gemini_Schema;

  function createEcho(source, formula) {

    /*
    //sophisticated
    const fieldPaths = formula.triggerFieldPathsArray.filter(fieldPath => fieldPath.source == source);
    const fieldDefinitions = createFieldDefinitions(source, fieldPaths);
    return createEcho(target, fieldDefinitions);
    */

    //coarse
    return Gemini_Schema.createEcho(source);
  }

  function createEchos(sources, formula) {
    return formula.targetSources.map(source => {
        return createEcho(source, formula);
    });
  }

  function createComputed(sources, formulas) {
    const echos = createEchos();

  }



  


  const Gemini = require("./Computed.js").Computed;

  function fieldsFunc(obj) {
    return obj._schema;
  }

  function fieldTypesSetter(obj, fieldTypes) {
    schema.defineTypes(obj.constructor, fieldTypes);
  }

  function computedMixin(fieldFormulas) {
    const mixin = Base => class extends Base {
      constructor() { //(...args)
        super();      ///(...args)
        Computed_Schema.registerComputed(this, fieldFormulas);
      }
    };
    return mixin;
  }

  function computedClass(fieldTypes, computedFieldFormulas) {

    const mixin = computedMixin(computedFieldFormulas);

    class Computed extends mixin(Gemini) {

    }
    fieldTypesSetter(Computed, fieldTypes);

    return Computed;
  }

  function createComputed(obj, computedFieldFormulas) {

    const fieldTypes  = fieldsFunc(target);
    const geminiClass = computedClass(fieldTypes, computedFieldFormulas);

    const geminiObject = createGeminiWithClass_Schema(geminiClass, target, isEcho);

    return geminiObject;
  }
  exports.Computed_Schema.createComputed = createComputed_Schema;


})();
