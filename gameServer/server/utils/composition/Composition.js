(function() {

exports.Composition = {};

function forwardProperty(propName, src, dst) {
  Object.defineProperty(src, propName, {
    get: function() {
      console.log("forward.get", propName);
      return dst[propName];
    },
    set: function(value) {
      console.log("forward.set", propName, value);
      dst[propName] = value;
    }
  });
}

function addComponent(component, composed) {

  if(!composed.$comp_components) {
    composed.$comp_components = [];
  }
  composed.$comp_components.push(component);

  const nativeFields = component.fieldsFunc(component.obj);
  Object.keys(nativeFields).forEach((fieldName, i) => {
    forwardProperty(fieldName, composed, component.obj);
  });

  composed.$comp_fieldTypesSetter(composed, nativeFields);

}

class Component {
  constructor(obj, fieldTypesSetter, fieldsFunc) {
    this.obj               = obj;
    this.fieldTypesSetter  = fieldTypesSetter;
    this.fieldsFunc        = fieldsFunc;
  }
}
exports.Composition.Component = Component;


function createComposed(baseClass, fieldTypesSetter, fieldsFunc, components) {

  class Composed extends baseClass {
    constructor() {
      super();
    }
  }

  const composed = new Composed();
  composed.$comp_fieldTypesSetter = fieldTypesSetter;
  composed.$comp_fieldsFunc       = fieldsFunc;

  components.forEach((component, i) => {
    addComponent(component, composed);
  });

  return composed;
}
exports.Composition.createComposed = createComposed;


})();
