(function() {

exports.Gemini = {};

const GeminiHatch = require("./GeminiHatch.js").GeminiHatch;

class FieldDefinition {

  constructor(fieldName, fieldType, isReadonly = false) {
    this.fieldName  = fieldName;

    this.fieldType  = fieldType;
    this.isReadonly = isReadonly && ((fieldType.$gemini_isEcho != null) && fieldType.$gemini_isEcho);
  }

}
exports.Gemini.FieldDefinition = FieldDefinition;

const handler={construct(){return handler}}; //Must return ANY object, so reuse one
const isConstructor=x=>{
    try{
        return !!(new (new Proxy(x,handler))())
    }catch(e){
        return false
    }
};

function isSubConstructor(ctorA, ctorB) {

  const protoB = ctorB.prototype;

  var proto = ctorA.prototype;
  var result = false;

  while (proto) {
      console.log(proto.constructor.name, "vs", protoB.constructor.name);
      if(proto === protoB) {
        console.log(proto.constructor.name, "===", protoB.constructor.name);
        result = true;
        break;
      }
      proto = Object.getPrototypeOf(proto);
  }

  return result;
}

function fieldDefsForTarget(dstClass, target, isEcho, fieldTypesSetter, fieldsFunc) {
  if(target.$gemini_fieldDefs) {
    return target.$gemini_fieldDefs();
  } else {
    const fields = fieldsFunc(target);
    return Object.fromEntries(
            Object.entries(fields).map(([fieldName, fieldType]) => {
              var geminiFieldType;

              const isCtor    = isConstructor(fieldType);
              console.log("fieldDefs", fieldName, "isCtor", isCtor);
              const isSubCtor = isCtor && isSubConstructor(fieldType, dstClass);
              console.log("fieldDefs", fieldName, "isSubCtor", isSubCtor);


              if(isSubCtor) {
                const fieldDefs   = fieldDefsForTarget(dstClass, fieldType, isEcho, fieldTypesSetter, fieldsFunc);
                const geminiClass = createGeminiClass(dstClass, fieldType, isEcho, fieldTypesSetter, fieldDefs);
                geminiFieldType = geminiClass;
              } else {
                geminiFieldType = fieldType;
              }
              console.log("fieldDefs", fieldName, "fieldType", fieldType);
              console.log("fieldDefs", fieldName, "geminiFieldType", geminiFieldType);

              return [fieldName, new FieldDefinition(fieldName, geminiFieldType, isEcho)];
            })
          );
  }
}

function fieldTypesForFieldDefs(fieldDefs) {
  return Object.fromEntries(
          Object.entries(fieldDefs).map(([fieldName, fieldDef]) => {
            return [fieldName, fieldDef.fieldType];
          })
        );
}

function createGeminiClass(dstClass, target, isEcho, fieldTypesSetter, fieldDefinitions) {
  console.log("createGeminiClass", target.constructor);
  var outClass;

  const targetClass = target.constructor;

  const fieldTypes = fieldTypesForFieldDefs(fieldDefinitions);
  const fieldsFunc = (obj) => {
    return fieldTypes;
  }

  const geminiMixin = Base => class extends Base {

    log() {
      console.log("super.$changes", super.$changes);
    }

    static $gemini_dstClass() {
      return dstClass;
    }
    static $gemini_fieldTypesSetter() {
      return fieldTypesSetter;
    }


    static $gemini_fieldDefs() {
      return fieldDefinitions;
    }
    static $gemini_fieldsFunc(obj) {
      fieldsFunc(obj);
    }
    static $gemini_isEcho() {
      return false;
    }
  };

  if(isEcho) {
    const echoMixin = Base => class extends Base {
      static $gemini_isEcho() {
        return true;
      }
    }
    class Echo extends echoMixin(geminiMixin(targetClass)) {}
    outClass = Echo;
  } else {
    class Gemini extends geminiMixin(targetClass) {}
    outClass = Gemini;
  }

  console.log("targetClass/A", targetClass);
  fieldTypesSetter(outClass, fieldTypes);
  console.log("outClass/B", outClass);

  return outClass;
}

function createGemini(dstClass, target, fieldTypesSetter, fieldsFunc, postGeminiCallback, isEcho = false, fieldDefinitions = null) {

  const fieldDefs   = fieldDefinitions ? fieldDefinitions : fieldDefsForTarget(dstClass, target, isEcho, fieldTypesSetter, fieldsFunc);
  const geminiClass = createGeminiClass(dstClass, target, isEcho, fieldTypesSetter, fieldDefs);

  const gemini = GeminiHatch.createGeminiWithClass(geminiClass, target, fieldsFunc, postGeminiCallback);

  return gemini;
}
exports.Gemini.createGemini = createGemini;


const miniClone = require("../mini/Mini.js").Mini.miniClone;

function createMiniGemini(dstClass, target, fieldTypesSetter, fieldsFunc, isEcho = false, miniSel) {

  const fieldDefs     = fieldDefsForTarget(dstClass, target, isEcho, fieldTypesSetter, fieldsFunc);
  console.log("fieldDefs", fieldDefs);
  const miniFieldDefs = miniClone(fieldDefs, miniSel);
  console.log("miniFieldDefs", miniFieldDefs);
  const geminiClass   = createGeminiClass(dstClass, target, isEcho, fieldTypesSetter, miniFieldDefs);

  class Mini extends geminiClass {}

  const gemini = GeminiHatch.createGeminiWithClass(Mini, target, fieldsFunc);

  return gemini;
}
exports.Gemini.createMiniGemini = createMiniGemini;


})();
