(function() {
exports.GeminiHatch = {};

  //bloodlink

function getBloodlinks(obj) {
  if(!obj.$_geminiBloodlinks) {
    obj.$_geminiBloodlinks = {};
  }
  return obj.$_geminiBloodlinks;
}

function addBloodlink(obj, propName) {
  getBloodlinks(obj)[propName] = true;
}
exports.GeminiHatch.addBloodlink = addBloodlink;

function getBloodlink(obj, propName) {
  return getBloodlinks(obj)[propName];
}

  //listeners

function getListeners(obj) {
  if(!obj.$_geminiListeners) {
    obj.$_geminiListeners = [];
  }
  return obj.$_geminiListeners;
}

function setListeners(obj, listeners) {
  obj.$_geminiListeners = listeners;
}

function addListener(obj, listener) {
  getListeners(obj).push(listener);
}

  //echo

function reportChange(obj, fieldName, isDelete) {
  if(obj.$onGeminiChange != null) {
    obj.$onGeminiChange(fieldName, isDelete);
  }
}

function updateInternals(target, gemini, fieldName, isDelete, postGeminiCallback) {
  const targetFieldValue = target[fieldName];
  console.log("targetFieldValue", targetFieldValue);

  const _fieldName = "_" + fieldName;
  if(targetFieldValue != null) {

    if(gemini[_fieldName] == null) {
      console.log("new organ field -> organ link");
      organlink(target, gemini, fieldName, postGeminiCallback);
    } else {
      gemini[_fieldName] = targetFieldValue;
    }

  } else {
    gemini[_fieldName] = targetFieldValue;
  }
}

function updateGemini(target, gemini, fieldName, isDelete, postGeminiCallback) {
  console.log("updateGemini", fieldName, isDelete);

  updateInternals(target, gemini, fieldName, isDelete, postGeminiCallback);
  reportChange(gemini, fieldName, isDelete);

  echo(gemini, fieldName, isDelete, postGeminiCallback);
}

function echo(obj, fieldName, isDelete, postGeminiCallback) {
  getListeners(obj).forEach((gemini, i) => {
    const geminiNeedsUpdate = ( (gemini.constructor.$gemini_fieldDefs())[fieldName] != null );
    if(geminiNeedsUpdate) {
      updateGemini(obj, gemini, fieldName, isDelete, postGeminiCallback);
    } else {
      // console.log("echo, geminiNeedsUpdate == false");
    }
  });
}

function createChangeFunc(obj, postGeminiCallback) {

  const changeFunc = (fieldName, isDelete) => {
    console.log("changeFunc", fieldName, isDelete);
    reportChange(obj, fieldName, isDelete);
    echo(obj, fieldName, isDelete, postGeminiCallback);
  }

  return changeFunc;

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

function echolink(target, gemini, postGeminiCallback) {

  if(!getChangeFunc(target)) {
    setChangeFunc(target, createChangeFunc(target, postGeminiCallback));
  }
  addListener(target, gemini);

  setChangeFunc(gemini, createChangeFunc(gemini, postGeminiCallback));
}

function organlink(target, gemini, fieldName, postGeminiCallback) {
  console.log("organlink", fieldName);
  const targetFieldValue = target[fieldName];
  const _fieldName = "_" + fieldName;
  if (targetFieldValue != null) {
    const fieldType = (gemini.constructor.$gemini_fieldDefs())[fieldName].fieldType;
    // console.log("organlink, fieldType:", fieldType);
    const isGeminiClass = fieldType.$gemini_fieldsFunc != null;
    // console.log("isGeminiClass", isGeminiClass);
    if(isGeminiClass) {
      const geminiClass = fieldType;
      gemini[_fieldName] = createGeminiWithClass(geminiClass, targetFieldValue, geminiClass.$gemini_fieldsFunc, postGeminiCallback);
    } else {
      gemini[_fieldName] = targetFieldValue;
    }
  } else {
    gemini[_fieldName] = targetFieldValue;  //null
  }
  bloodlink(target, gemini, fieldName);
}

function bloodlink(target, gemini, propName) {
  console.log("bloodlink", propName);

  if(!getBloodlink(target, propName)) {
    Object.defineProperty(target, propName, {
      get: function() {
        console.log(target.$name, ".get", propName);
        console.log("target.get", propName);
        const _propName = "_" + propName;
        return target[_propName];
      },
      set: function(value) {
        console.log(target.$name, ".set", propName, value);
        console.log("target.set", propName, value);
        const _propName = "_" + propName;
        target[_propName] = value;

        const changeFunc = getChangeFunc(target);
        changeFunc(propName);
      }
    });
    addBloodlink(target, propName);
  }

  if(!gemini.constructor.$gemini_isEcho()) {

    Object.defineProperty(gemini, propName, {
      get: function() {
        // console.log(gemini.$debug_name, ".get", propName);
        console.log("gemini.get", propName);
        const _propName = "_" + propName;
        return gemini[_propName];
      },
      set: function(value) {
        console.log("gemini.set", propName, value);

        // console.log(gemini.$debug_name, "->", target.$debug_name);
        target[propName] = value;

        const changeFunc = getChangeFunc(gemini);
        changeFunc(propName);
      }
    });
    addBloodlink(gemini, propName);

  } else {

    Object.defineProperty(gemini, propName, {
      get: function() {
        // console.log(gemini.$debug_name, ".get", propName);
        console.log("echo.get", propName);
        const _propName = "_" + propName;
        return gemini[_propName];
      },
      set: function(value) {
        console.log("echo.set", propName, value);
        throw new Error("an echo cannot set its properties");
      }
    });
    addBloodlink(gemini, propName);

  }

}

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


function geminiCloneWithClass(geminiClass, obj) {
  console.log("geminiCloneWithClass", geminiClass.name, obj);
  var cloned = new (geminiClass)();

  const fieldDefs = geminiClass.$gemini_fieldDefs(obj);
  for (var fieldName in fieldDefs) {
      const value = obj[fieldName];
      if(value != null) {
        const fieldType = fieldDefs[fieldName].fieldType;
        // console.log("geminiCloneWithClass, fieldType:", fieldName, fieldType, fieldType.$gemini_fieldDefs);
        if (fieldType.$gemini_fieldDefs) {
            // deep clone
            cloned[fieldName] = geminiCloneWithClass(fieldType, value);
        }
        else {
            // primitive values
            cloned[fieldName] = value;
        }
      } else {
        cloned[fieldName] = value;
      }
  }

  return cloned;
}

function createGeminiWithClass(geminiClass, target, fieldsFunc, postGeminiCallback) {
  // console.log("createGeminiWithClass", geminiClass);

  const targetIsEcho = (target.constructor.$gemini_isEcho != null && target.constructor.$gemini_isEcho());
  const geminiIsEcho = geminiClass.$gemini_isEcho();

  //check compatibility
  if(targetIsEcho && !geminiIsEcho) {
    throw new Error("Gemini error, cannot gemini() an echo");
  }

  //prepare target
  const prepared = isPrepared(target, fieldsFunc);
  if(!prepared) {
    prepareForBloodlink(target, fieldsFunc);
  } else {
    console.log("target is prepared");
  }

  //create gemini
  const gemini = geminiCloneWithClass(geminiClass, target);
  console.log("***gemini.log():", gemini.log());
  // console.log("***gemini.a.log():", gemini.a.log());


  //bind gemini and target
  const fieldDefs = gemini.constructor.$gemini_fieldDefs();
  for (var fieldName in fieldDefs) {
    organlink(target, gemini, fieldName, postGeminiCallback);
  }
  // console.log("**after organlink:", gemini.a);

  echolink(target, gemini, postGeminiCallback);
  // console.log("**after echolink:", gemini.a);

  postGeminiCallback(target, gemini);

  return gemini;
}
exports.GeminiHatch.createGeminiWithClass = createGeminiWithClass;


})();
