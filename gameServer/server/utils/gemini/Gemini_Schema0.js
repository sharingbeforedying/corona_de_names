(function() {
  exports.Gemini_Schema = {};

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
          console.log("isConstructor, error:", e);
          return false;
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
    console.log("isContainer", value);

    //???
    try {
      const ctor = value.constructor;
      const nude = new (ctor)();
      console.log("nude:", nude);
    } catch(e) {
      console.log(e);
      return false;
    }

    // if(!isConstructor(value)) {
    //   console.log("!isConstructor(value)");
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
      console.log("!isConstructor(type)");
      return false;
    }
    const isAnyContainerType = isSchemaType(type) || isMapSchemaType(type) || isArraySchemaType(type);
    console.log("isAnyContainerType", isAnyContainerType);
    return isAnyContainerType;
  }



  function mapTargetElements(target, cloned, elementMapper) {
    if(isSchema(target)) {
      const props = Object.keys(target._schema);
      console.log("mapTargetElements, isSchema, props:", props);
      props.forEach((prop, i) => {
        const value = target[prop];
        if(value != null) {
          cloned[prop] = elementMapper(value);
        }
      });
    } else if(isMapSchema(target)) {
      const props = Object.keys(target);
      console.log("mapTargetElements, isMap, keys:", Object.keys(target));
      props.forEach((prop, i) => {
        const value  = target[prop];
        cloned[prop] = elementMapper(value);
      });
    } else if(isArraySchema(target)) {
      console.log("mapTargetElements, isArray:", target);
      cloned.push(...target.map(elementMapper));
    } else {
      throw new Error("target cannot be a gemini source", target);
    }
  }


  ////broadcaster

  class Broadcaster {
    constructor() {
      this.geminiListeners = [];
    }

    addGeminiListener(gemini) {
      console.log("addGeminiListener", gemini);
      this.geminiListeners.push(gemini);
    }

    broadcast(prop, value) {
      console.log("broadcast", prop, value);
      console.log("geminiListeners", this.geminiListeners);
      this.geminiListeners.forEach((gemini, i) => {
        gemini.update(prop, value);
      });
    };

  }

  ////content

  function isContentPropFunc(obj) {
    console.log("isContentPropFunc", obj);

    if(isSchema(obj)) {
      return (prop) => (obj._schema[prop] != null);
    }

    if(isMapSchema(obj)) {
      const nude = new MapSchema();
      const nudePropsArray = Object.keys(nude);
      console.log("MapSchema", "nudePropsArray", nudePropsArray);

      // console.log("Object.keys(MapSchema.prototype)", Object.keys(MapSchema.prototype));
      // console.log("Object.keys(new Proxy(nude, {})", Object.keys(new Proxy(nude, {})));

      // console.log("xxx STOP xxx");console.log({}.stop.stop);

      const handPropsArray = [
        "$changes",
        "onAdd",
        "onRemove",
        "onChange",
        "clone",
        "triggerAll",
        "toJSON",

        "_indexes",
        "_updateIndexes",
      ];

      const nonContentPropsArray = [].concat(nudePropsArray, handPropsArray);

      const nonContentProps = Object.fromEntries(nonContentPropsArray.map(prop => [prop, true]));
      return (prop) => {
        return !nonContentProps[prop];
      };
    }

    if(isArraySchema(obj)) {
      const nude = new ArraySchema();
      const nudePropsArray = Object.keys(nude);
      console.log("ArraySchema", "nudeProps", nudePropsArray);

      const handPropsArray = [
        "$changes",
        "onAdd",
        "onRemove",
        "onChange",
        "clone",
        "triggerAll",
        "toJSON",

        // "_indexes",
        // "_updateIndexes",
        "$sorting",
      ];

      const nonContentPropsArray = [].concat(nudePropsArray, handPropsArray);

      const nonContentProps = Object.fromEntries(nonContentPropsArray.map(prop => [prop, true]));
      return (prop) => {
        return !nonContentProps[prop];
      };
    }

    throw new Error("unknown type for object", obj);
  }

  //// gemini source

  function geminiSourceClone(target) {
    var cloned = new (target.constructor)();

    const elementMapper = (element) => {
      var mapped;

      if(isContainer(element)) {
        mapped = createSource(element);
      } else {
        mapped = element;
      }

      return mapped;
    };

    mapTargetElements(target, cloned, elementMapper);

    return cloned;
  }

  function createSource(target) {
    console.log("createGeminiSource", JSON.stringify(target));

    const sourceClone = geminiSourceClone(target);

    const broadcaster = new Broadcaster();

    const isContentProp = isContentPropFunc(sourceClone);

    const source = new Proxy(sourceClone, {
        get: function (obj, prop) {
          console.log("source get", prop);
          if(prop == "addGeminiListener") {
            return broadcaster[prop].bind(broadcaster);
          } else {
            return obj[prop];
          }
        },
        set: function (obj, prop, setValue) {
            console.log("source set", prop);
            if(isContentProp(prop)) {
              console.log("contentProp:", prop);
              if(setValue != null && isContainer(setValue)) {
                console.log("create gemini source", prop);
                obj[prop] = createGeminiSource(setValue);
              } else {
                obj[prop] = setValue;
              }
              // console.log("gemini source did set", prop /*,setValue*/ );
              broadcaster.broadcast(prop, obj[prop]);
            } else {
              console.log("legacy set");
              obj[prop] = setValue;
            }
            return true;
        },
    });

    return source;
  }
  exports.Gemini_Schema.createSource = createSource;





  // const updateGeminiListeners_breadth = (obj, prop, value) => {
  //
  //   const geminiListeners = obj.geminiListeners;
  //   if(geminiListeners) {
  //     geminiListeners.forEach((gemini, i) => {
  //       gemini.updateInternals(prop, value);
  //     });
  //     geminiListeners.forEach((gemini, i) => {
  //       updateGeminiListeners_breadth(gemini, prop, value);
  //     });
  //   }
  //
  // }
  //
  // const updateGeminiListeners_depth = (obj, prop, value) => {
  //
  //   const geminiListeners = obj.geminiListeners;
  //   if(geminiListeners) {
  //     geminiListeners.forEach((gemini, i) => {
  //       gemini.updateInternals(prop, value);
  //       updateGeminiListeners_depth(gemini, prop, value);
  //     });
  //   }
  //
  // }






  ////gemini

  function geminiClone(target) {
    console.log("geminiClone", target);
    var cloned = new (target.constructor)();

    const elementMapper = (element) => {

      if(isContainer(element)) {
        return createGemini(element);
      } else {
        return element;
      }
    }

    mapTargetElements(target, cloned, elementMapper);

    return cloned;
  }

  function createGemini(target) {
    console.log("createGemini", JSON.stringify(target));

    //ensure (gemini instanceof target.constructor)
    const targetClass = target.constructor;
    const fake = new (targetClass)();
    // console.log("fake instanceof target.constructor", fake instanceof targetClass)

    const receiver = {};
    const inner    = geminiClone(target);

    const broadcaster = new Broadcaster();

    const isContentProp = isContentPropFunc(fake);

    const gemini = new Proxy(fake, {
        get: function (obj, prop) {
          console.log("gemini get", prop);
          if(prop == "constructor") {
            return inner.constructor;
          } else if(prop == "addGeminiListener") {
            return broadcaster[prop].bind(broadcaster);
          } else if(receiver[prop]) {
            console.log("receiver prop");
            return receiver[prop];
          } else {
            console.log("inner prop");
            return inner[prop];
          }
        },
        set: function (obj, prop, setValue) {
            console.log("gemini set", prop);
            if(isContentProp(prop)) {
              console.log("contentProp:", prop);
              console.log("forward set to source", prop);
              target[prop] = setValue;
            }
            else {
              console.log("legacy set", prop /*,setValue*/ );
              inner[prop] = setValue;
            }
            return true;
        },
    });
    // console.log("gemini instanceof target.constructor", gemini instanceof targetClass);

    function updateInternals(prop, value) {
      console.log("updateInternals", prop, value);
      if(inner[prop] == null && isContainer(value)) {
        inner[prop] = createGemini(value);
      } else {
        inner[prop] = value;
      }
      console.log("updated inner : JSON.stringify(inner)", JSON.stringify(inner));
    };

    receiver.update = (prop,value) => {
      updateInternals(prop,value);
      broadcaster.broadcast(prop,value);
    }

    target.addGeminiListener(gemini);

    return gemini;
  }
  exports.Gemini_Schema.createGemini = createGemini;

  function createEcho(target) {

    const gemini = createGemini(target);

    const isContentProp = isContentPropFunc(gemini);

    const echo = new Proxy(gemini, {
        set: function (obj, prop, setValue) {
          console.log("echo set", prop);
          // if(obj._schema[prop]) {
          if(isContentProp(prop)) {
            throw new Error("cannot set _schema property on an echo");
            return false;
          }
          obj[prop] = setValue;
          return true;
        },
    });

    return echo;
  }
  exports.Gemini_Schema.createEcho = createEcho;


})();
