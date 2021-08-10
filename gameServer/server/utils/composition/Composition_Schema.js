(function() {
exports.Composition = {};
exports.Composition.Schema = {};

const Composition = require("./Composition.js").Composition;

const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;

function fieldsFunc(obj) {
  return obj._schema;
}

function fieldTypesSetter(obj, fieldTypes) {
  schema.defineTypes(obj.constructor, fieldTypes);
}

function createComponent(schemaInstance) {
  return new (Composition.Component)(schemaInstance, fieldTypesSetter, fieldsFunc);
}

function decorateComponentChangeFunc(schemaInstance, composedChangeFunc) {
  const nativeChangeFunc = changeFunc(schemaInstance);

  const newChangeFunc = (fieldName, isDelete) => {
    console.log("component change", fieldName, isDelete);
    nativeChangeFunc(fieldName, isDelete);
    console.log("report change to composed", fieldName, isDelete);
    composedChangeFunc(fieldName, isDelete);
  };

  changeFuncSetter(schemaInstance, newChangeFunc);
}

function changeFuncSetter(obj, changeFunc) {
  obj.$changes.change = changeFunc;
}

function changeFunc(obj) {
  return obj.$changes.change.bind(obj.$changes);
}

function createComposed_Schema(...schemaInstances) {

  const components = schemaInstances.map(createComponent);
  const composed   = Composition.createComposed(Schema, fieldTypesSetter, fieldsFunc, components);

  //report component changes to composed changeFunc
  const composedChangeFunc = changeFunc(composed);
  schemaInstances.forEach((schemaInstance, i) => {
    decorateComponentChangeFunc(schemaInstance, composedChangeFunc);
  });

  return composed;
}
exports.Composition.Schema.createComposed = createComposed_Schema;

})();
