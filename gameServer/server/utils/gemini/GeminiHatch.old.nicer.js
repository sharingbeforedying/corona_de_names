(function() {

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

function updateInternals(target, gemini, fieldName, isDelete, fieldsFunc) {
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
}

function updateGemini(target, gemini, fieldsFunc, fieldName, isDelete) {
  console.log("updateGemini", fieldName, isDelete);

  updateInternals(target, gemini, fieldName, isDelete, fieldsFunc);
  reportChange(gemini, fieldName, isDelete);

  echo(gemini, fieldName, isDelete, fieldsFunc);
}

function echo(obj, fieldName, isDelete, fieldsFunc) {
  getListeners(obj).forEach((gemini, i) => {
    const miniSel = gemini.$gemini_miniSel;
    const geminiNeedsUpdate = ( miniSel == null || ( miniSel != null && (fieldName in miniSel) ) );
    if(geminiNeedsUpdate) {
      updateGemini(obj, gemini, fieldsFunc, fieldName, isDelete);
    } else {
      // console.log("echo, geminiNeedsUpdate == false");
    }
  });
}

function createChangeFunc(obj, fieldsFunc) {

  const changeFunc = (fieldName, isDelete) => {
    console.log("changeFunc", fieldName, isDelete);
    reportChange(obj, fieldName, isDelete);
    echo(obj, fieldName, isDelete, fieldsFunc);
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

function echolink(target, gemini, fieldsFunc) {

  if(!getChangeFunc(target)) {
    setChangeFunc(target, createChangeFunc(target, fieldsFunc));
  }
  addListener(target, gemini);

  setChangeFunc(gemini, createChangeFunc(gemini, fieldsFunc));
}

function organlink(target, gemini, fieldName, fieldsFunc) {
  console.log("organlink", fieldName);
  const targetFieldValue = target[fieldName];
  const _fieldName = "_" + fieldName;
  if (fieldsFunc(targetFieldValue) != null) {
    const miniSel = gemini.$gemini_miniSel;
    const organMiniSel = miniSel ? miniSel[fieldName] : null;
    gemini[_fieldName] = createGemini(fieldName, targetFieldValue, fieldsFunc, gemini.$gemini_isEcho, organMiniSel);
  } else {
    gemini[_fieldName] = targetFieldValue;
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

  if(!gemini.$gemini_isEcho) {

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
    // addBloodlink(gemini, propName);

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

const miniClone = require("../mini/Mini.js").Mini.miniClone;

function createGeminiWithClass(geminiClass, target, fieldsFunc, isEcho, miniSel = null) {
  console.log("createGemini", name);

  if(target.$gemini_isEcho && isEcho == false) {
    throw new Error("Gemini error, cannot gemini() an echo");
  }

  const gemini = miniClone(target, fieldsFunc, miniSel);
  gemini.$gemini_isEcho  = isEcho;
  gemini.$gemini_miniSel = miniSel;

  const prepared = isPrepared(target, fieldsFunc);
  if(!prepared) {
    prepareForBloodlink(target, fieldsFunc);
  } else {
    console.log("target is prepared");
  }

  const fields = fieldsFunc(gemini);
  for (var fieldName in fields) {
    organlink(target, gemini, fieldName, fieldsFunc);
  }

  echolink(target, gemini, fieldsFunc);

  return gemini;
}
exports.createGeminiWithClass = createGeminiWithClass;

function geminiMixin(fieldsFunc) {
  const mixin = Base => class extends Base {
    getGeminiFieldsFunc() {
      return fieldsFunc;
    }
  };
  return mixin;
}

})();
