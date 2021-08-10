(function() {

function createChangeFunc(obj) {
  return (fieldName, isDelete) => {
    // console.log("$geminiOnChange", this, fieldName, isDelete);
    console.log("native $geminiOnChange");

    if(obj.$onGeminiChange != null) {
      obj.$onGeminiChange(fieldName, isDelete);
    }
  };
}

function getChangeFunc(obj) {
  var outFunc = null;
  const f_unbound = obj.$_geminiOnChange;
  if(f_unbound) {
    // outFunc = f_unbound.bind(obj);
    outFunc = f_unbound;
  }
  return outFunc;
}

function setChangeFunc(obj, changeFunc) {
  obj.$_geminiOnChange = changeFunc;
}

function eyelink(target, gemini, fieldsFunc) {

  if(!getChangeFunc(target)) {
    setChangeFunc(target, createChangeFunc(target));
  }
  setChangeFunc(gemini, createChangeFunc(gemini));

  const nativeTargetOnChange = getChangeFunc(target);

  const updateGemini = (fieldName, isDelete) => {
    console.log("updateGemini", fieldName, isDelete);

    const targetFieldValue = target[fieldName];
    console.log("targetFieldValue", targetFieldValue);

    const _fieldName = "_" + fieldName;
    if(targetFieldValue != null) {

      if(gemini[_fieldName] == null) {

        if(fieldsFunc(targetFieldValue) != null) {
          console.log("new organ field -> organ link");
          organlink(target, gemini, fieldName, fieldsFunc);
        } else {
          gemini[_fieldName] = targetFieldValue;
        }
      } else {
        gemini[_fieldName] = targetFieldValue;
      }

    } else {
      gemini[_fieldName] = targetFieldValue;
    }

    if(gemini.$onGeminiChange != null) {
      gemini.$onGeminiChange(fieldName, isDelete);
    }

  };

  const newTargetOnChange = (fieldName, isDelete) => {
    console.log("new target onChange", fieldName, isDelete);
    nativeTargetOnChange(fieldName, isDelete);
    updateGemini(fieldName, isDelete);
  }

  setChangeFunc(target, newTargetOnChange);
}

function organlink(target, gemini, fieldName, fieldsFunc) {
  console.log("organlink", fieldName);
  const targetFieldValue = target[fieldName];
  const _fieldName = "_" + fieldName;
  if (fieldsFunc(targetFieldValue) != null) {
      gemini[_fieldName] = createGemini(fieldName, targetFieldValue, fieldsFunc);
  } else {
      gemini[_fieldName] = targetFieldValue;
  }
  bloodlink(target, gemini, fieldName);
}

function bloodlink(target, gemini, propName) {
  console.log("bloodlink", propName);

  Object.defineProperty(target, propName, {
    get: function() {
      console.log("target.get", propName);
      const _propName = "_" + propName;
      return target[_propName];
    },
    set: function(value) {
      console.log("target.set", propName, value);
      const _propName = "_" + propName;
      target[_propName] = value;

      const changeFunc = getChangeFunc(target);
      changeFunc(propName);
    }
  });

  Object.defineProperty(gemini, propName, {
    get: function() {
      console.log("gemini.get", propName);
      const _propName = "_" + propName;
      return gemini[_propName];
    },
    set: function(value) {
      console.log("gemini.set", propName, value);
      target[propName] = value;

      const changeFunc = getChangeFunc(gemini);
      changeFunc(propName);
    }
  });

}

function cloneFunc(fieldsFunc) {
  return (obj) => {
    var cloned = new (obj.constructor);

    for (var field in fieldsFunc(obj)) {
        const value = obj[field];
        if(value != null) {
          const fields = fieldsFunc(value);
          if (fields != null) {
              // deep clone
              cloned[field] = cloneFunc(value, fieldsFunc);
          }
          else {
              // primitive values
              cloned[field] = value;
          }
        } else {
          cloned[field] = value;
        }
    }
    return cloned;
  }
};

function isPrepared(obj, fieldsFunc) {
  var outBool = true;
  for (var fieldName in fieldsFunc(obj)) {
    const _fieldName = "_" + fieldName;
    if(obj[_fieldName] === undefined) {
      outBool = false;
      break;
    }
  }
  return outBool;
}

function prepareForBloodlink(obj, fieldsFunc) {
  console.log("prepare for bloodlink");
  for (var fieldName in fieldsFunc(obj)) {
    const _fieldName = "_" + fieldName;
    if(obj[_fieldName] != obj[fieldName]) {
      obj[_fieldName] = obj[fieldName];
    }
  }
}

function createGemini(name, target, fieldsFunc) {
  console.log("createGemini", name);

  const gemini = (cloneFunc(fieldsFunc))(target);

  const prepared = isPrepared(target, fieldsFunc);
  if(!prepared) {
    prepareForBloodlink(target, fieldsFunc);
  } else {
    console.log("target is prepared");
  }

  eyelink(target, gemini, fieldsFunc);

  for (var fieldName in fieldsFunc(target)) {
    organlink(target, gemini, fieldName, fieldsFunc);
  }

  return gemini;
}

exports.createGemini = createGemini;


})();
