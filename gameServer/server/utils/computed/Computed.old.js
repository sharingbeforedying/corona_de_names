(function() {

exports.Computed = {};

class FieldFormula {

  constructor(fieldName, triggerFieldNames, computeFunc, initialFunc = null) {
    this.fieldName         = fieldName;
    this.triggerFieldNames = triggerFieldNames;
    this.computeFunc       = computeFunc;   //in the form computeFunc(obj)
    this.initialFunc       = initialFunc;   //in the form initialFunc(obj)

    this.updateFunc = this.setterFunc(computeFunc);

    if(initialFunc) {
      this.initFunc = this.setterFunc(initialFunc);
    } else {
      this.initFunc = this.setterFunc(computeFunc);
    }
  }

  setterFunc(valueFunc) {
    return (obj) => {
      //this calls setter if setter exists
      obj[this.fieldName] = valueFunc(obj);
    };
  }

}
exports.Computed.FieldFormula = FieldFormula;


class FieldFormulaGroup {

  constructor(fieldFormulas) {
    this.updateFuncsMap = {};

    fieldFormulas.forEach((formula, i) => {
      this.addFormula(formula);
    });
  }

  registerTriggerFieldName(triggerFieldName, updateFunc) {
    if(!this.updateFuncsMap[triggerFieldName]) {
      this.updateFuncsMap[triggerFieldName] = [];
    }
    this.updateFuncsMap[triggerFieldName].push(updateFunc);
  }

  addFormula(formula) {
    formula.triggerFieldNames.forEach((triggerFieldName, i) => {
      this.registerTriggerFieldName(triggerFieldName, formula.updateFunc);
    });

  }

}

function decorateChangeFunc(obj, changeFunc, changeFuncSetter, fieldFormulas) {
  const fieldFormulaGroup = new FieldFormulaGroup(fieldFormulas);

  const nativeChangeFunc = changeFunc;

  const updateComputed = (fieldName, isDelete) => {
    console.log("updateComputed", fieldName, isDelete);

    const updateFuncs = fieldFormulaGroup.updateFuncsMap[fieldName];
    if(updateFuncs) {
      updateFuncs.forEach((updateFunc, i) => {
        updateFunc(obj);
      });
    }

  };

  const newChangeFunc = (fieldName, isDelete) => {
    console.log("newChangeFunc", fieldName, isDelete);
    updateComputed(fieldName, isDelete);
    nativeChangeFunc(fieldName, isDelete);
  }

  changeFuncSetter(newChangeFunc);
}

function registerComputed(obj, changeFunc, changeFuncSetter, fieldFormulas) {

  decorateChangeFunc(obj, changeFunc, changeFuncSetter, fieldFormulas);

  if(!obj.$computed) {
    obj.$computed = {};
  }

  fieldFormulas.forEach((formula, i) => {
    obj.$computed[formula.fieldName] = formula;
    formula.initFunc(obj);
  });

}
exports.Computed.registerComputed = registerComputed;


})();
