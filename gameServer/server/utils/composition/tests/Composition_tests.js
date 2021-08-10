(function() {
  exports.Composition_tests = {};

  const Composition = require("../Composition.js").Composition;

  const mini = require("../../mini/Mini.js").Mini.mini;
  const sample = require("../../Sample.js").sample;

  function testComposed(composed) {

    const components = composed.$comp_components;

    //types
    console.log("types");

    function logTypes(name, obj, fieldsFunc) {
      console.log(name, fieldsFunc(obj));
    }

    logTypes("composed", composed, composed.$comp_fieldsFunc);
    components.forEach((component, i) => {
      logTypes("component", component.obj, component.fieldsFunc);
    });

    //values

    console.log("values");

    function logValues(name, obj, fieldsFunc) {
      Object.keys(fieldsFunc(obj)).forEach((fieldName, i) => {
        console.log(name + "." + fieldName, obj[fieldName]);
      });
    }

    logValues("composed", composed, composed.$comp_fieldsFunc);
    components.forEach((component, i) => {
      logValues("component", component.obj, component.fieldsFunc);
    });

  }
  exports.Composition_tests.testComposed = testComposed;


  ///////////

  function test_Object() {

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

    function fieldTypesSetter(obj, fields) {
      if(!obj.$fields) {
        obj.$fields = {};
      }
      obj.$fields = Object.assign(obj.$fields, fields);
    }

    class ClassB {
      constructor (str,nb) {
          // super();
          this.strB = str;
          this.nbB  = nb;
      }
    }

    class ClassA {
      constructor (strA,nbA,strB,nbB) {
          // super();
          this.strA = strA;
          this.nbA  = nbA;
          this.b    = new ClassB(strB,nbB);
      }
    }

    const obj1       = new ClassA("a",0,"b",1);
    console.log("fieldsFunc(obj1)", fieldsFunc(obj1));
    const component1 = new (Composition.Component)(obj1, fieldTypesSetter, fieldsFunc);
    console.log("fieldsFunc(component1.obj)", fieldsFunc(component1.obj));
    console.log("component1.obj.strA", component1.obj.strA);



    const obj2       = new ClassB("b222",222);
    console.log("fieldsFunc(obj2)", fieldsFunc(obj2));
    const component2 = new (Composition.Component)(obj2, fieldTypesSetter, fieldsFunc);

    const components = [component1, component2];
    const composed   = Composition.createComposed(Object, fieldTypesSetter, fieldsFunc, components);

    testComposed(composed);

  }
  exports.Composition_tests.test_Object = test_Object;

  function test_Schema() {

    const Composition_Schema = require("../Composition_Schema.js").Composition.Schema;

    const schema    = require('@colyseus/schema');
    const Schema    = schema.Schema;

    class SchemaB extends Schema {
      constructor (str,nb) {
          super();
          this.strB = str;
          this.nbB  = nb;
      }
    }
    schema.defineTypes(SchemaB, {
      strB        : "string",
      nbB         : "number",
    });

    class SchemaA extends Schema {
      constructor (strA,nbA,strB,nbB) {
          super();
          this.strA = strA;
          this.nbA  = nbA;
          this.b    = new SchemaB(strB,nbB);
      }
    }
    schema.defineTypes(SchemaA, {
      strA        : "string",
      nbA         : "number",
      b           : SchemaB,
    });

    const obj1       = new SchemaA("a",0,"b",1);
    const obj2       = new SchemaB("b222",222);

    const composed   = Composition_Schema.createComposed(obj1, obj2);

    testComposed(composed);

  }
  exports.Composition_tests.test_Schema = test_Schema;

})();
