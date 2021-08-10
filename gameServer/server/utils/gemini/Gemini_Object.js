(function() {
  exports.Gemini_Object = {};

  const createGemini = require("./GeminiHatch.js").createGemini;

  function fieldsFunc(obj) {
    if(!obj.$fields) {
      if(obj instanceof Object) {
        obj.$fields = Object.fromEntries(Object.keys(obj)
                                          .filter(key => !key.startsWith("_"))
                                          .filter(key => !key.startsWith("$"))
                                          .map(key => [key, typeof obj[key]])
                                          .filter(([fieldName, type]) => {
                                              const allowedTypes = ['string', 'number', 'object'];
                                              return allowedTypes.includes(type);
                                           })
                                   );
      } else {
        obj.$fields = {};
      }
    }

    return obj.$fields;
  }
  exports.Gemini_Object.fieldsFunc = fieldsFunc;

  function fieldTypesSetter(obj, fields) {
    if(!obj.$fields) {
      obj.$fields = {};
    }
    obj.$fields = Object.assign(obj.$fields, fields);
  }
  exports.Gemini_Object.fieldTypesSetter = fieldsFunc;



  function createGemini_Object(target, isEcho, miniSel) {

    const name = target.constructor.name;
    return createGemini(name, target, fieldsFunc, isEcho, miniSel);
  }
  exports.Gemini_Object.createGemini = (target) => createGemini_Object(target, isEcho = false, miniSel = null);
  exports.Gemini_Object.createEcho   = (target) => createGemini_Object(target, isEcho = true,  miniSel = null);

})();
