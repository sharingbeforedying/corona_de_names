(function() {
  exports.Clone_Schema = {};

  const schema    = require('@colyseus/schema');
  const Schema    = schema.Schema;
  const MapSchema    = schema.MapSchema;
  const ArraySchema  = schema.ArraySchema;



  ////utils

  const handler={construct(){return handler}}; //Must return ANY object, so reuse one
  const isConstructor=x=>{
      try{
          return !!(new (new Proxy(x,handler))());
      }catch(e){
          //console.log("isConstructor, error:", e);
          return false;
      }
  };

  function isSubConstructor(ctorA, ctorB) {

    const protoB = ctorB.prototype;

    var proto = ctorA.prototype;
    var result = false;

    while (proto) {
        //console.log(proto.constructor.name, "vs", protoB.constructor.name);
        if(proto === protoB) {
          //console.log(proto.constructor.name, "===", protoB.constructor.name);
          result = true;
          break;
        }
        proto = Object.getPrototypeOf(proto);
    }

    return result;
  }

  function isArraySchema(value) {
    const type = value.constructor;
    return isArraySchemaType(type);
  }
  function isMapSchema(value) {
    const type = value.constructor;
    return isMapSchemaType(type);
  }
  function isSchema(value) {
    const type = value.constructor;
    return isSchemaType(type);
  }

  function isContainer(value) {
    //console.log("isContainer", value);

    //???
    try {
      const ctor = value.constructor;
      const nude = new (ctor)();
      //console.log("nude:", nude);
    } catch(e) {
      //console.log(e);
      return false;
    }

    // if(!isConstructor(value)) {
    //   //console.log("!isConstructor(value)");
    //   return false;
    // }
    return isContainerType(value.constructor);
  }




  function isArraySchemaType(type) {
    // return Array.isArray(type);
    return type === ArraySchema;
  }
  function isMapSchemaType(type) {
    // return !isArrayType(type) && (type.map != null);
    return type === MapSchema;
  }
  function isSchemaType(type) {
    return (type.prototype._schema != null);
    //or we can use isSubConstructor(type, Schema);
  }

  function isContainerType(type) {
    if(!isConstructor(type)) {
      //console.log("!isConstructor(type)");
      return false;
    }
    const isAnyContainerType = isSchemaType(type) || isMapSchemaType(type) || isArraySchemaType(type);
    //console.log("isAnyContainerType", isAnyContainerType);
    return isAnyContainerType;
  }



  function mapTargetElements(target, cloned, elementMapper) {
    if(isSchema(target)) {
      const props = Object.keys(target._schema);
      //console.log("mapTargetElements, isSchema, props:", props);
      props.forEach((prop, i) => {
        const value = target[prop];
        if(value != null) {
          cloned[prop] = elementMapper(value);
        }
      });
    } else if(isMapSchema(target)) {
      const props = Object.keys(target);
      //console.log("mapTargetElements, isMap, keys:", Object.keys(target));
      props.forEach((prop, i) => {
        const value  = target[prop];
        cloned[prop] = elementMapper(value);
      });
    } else if(isArraySchema(target)) {
      //console.log("mapTargetElements, isArray:", target);
      cloned.push(...target.map(elementMapper));
    } else {
      throw new Error("target cannot be cloned", target);
    }
  }




  /////clone

  function clone(target) {
    var cloned = new (target.constructor)();

    const elementMapper = (element) => {
      var mapped;

      if(isContainer(element)) {
        mapped = clone(element);
      } else {
        mapped = element;
      }

      return mapped;
    };

    mapTargetElements(target, cloned, elementMapper);

    return cloned;
  }
  exports.Clone_Schema.clone = clone;


})();
