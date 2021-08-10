function debug() {
  console.log(Object.assign({lil: "lil"}, {lol : "lol"}));

  test1();

  test2();

  test3();

  test4();

  test5();

  console.log("new Set([1,2]) == new Set([2,1])", new Set([1,2]) == new Set([2,1]));

  const combinations = require("./utils/Utils.js").Utils.combinations;
  console.log("comb 1", combinations([10,20,30,40,50,60], 1));
  console.log("comb 2", combinations([10,20,30,40,50,60], 2));
  console.log("comb 3", combinations([10,20,30,40,50,60], 3));

  class Gemini {
    constructor() {
      this.name = "top";
    }
  }

  const instance = new Gemini();
  console.log("instance", instance);

  {
    class Gemini {
      constructor() {
        this.name = "sub";
      }
    }

    const instance_sub = new Gemini();
    console.log("instance_sub", instance_sub);
  }





  class A {
    constructor() {
      console.log("A");
    }
  }
  const classA = A;
  class B extends classA {
    constructor(){
      console.log("super()", super());
    }
  }
  console.log("B", B);
  console.log("new B()", new B());





  //test schema definition
  {
    const schema    = require('@colyseus/schema');
    const Schema    = schema.Schema;

    class MySchema extends Schema {
      constructor (str,nb) {
          super();
          this.str = str;
          schema.defineTypes(MySchema, {
            str        :  "string",
          });

          this.nb  = nb;
          schema.defineTypes(MySchema, {
            nb         :  "number",
          });
      }
    }

    const mySchemaInstance = new MySchema("abc", 123);
    console.log("mySchemaInstance", mySchemaInstance);

    console.log("mySchemaInstance._schema", mySchemaInstance._schema);

    {
      class MySchema extends Schema {
        constructor (str,nb) {
            super();
            this.strSub = str;
            schema.defineTypes(MySchema, {
              strSub        :  "string",
            });

            this.nbSub  = nb;
            schema.defineTypes(MySchema, {
              nbSub         :  "number",
            });
        }
      }

      const mySchemaInstance = new MySchema("abc", 123);
      console.log("mySchemaInstance", mySchemaInstance);

      console.log("mySchemaInstance._schema", mySchemaInstance._schema);
    }
  }

  //test B is A
  {
    class A {
      constructor() {
        console.log("A");
      }
    }
    const classA = A;
    class B extends classA {
      constructor(){
        console.log("super()", super());
      }
    }
    console.log("B", B);
    console.log("new B()", new B());

    function likeTheOtherClass(class1, class2) {
      if(class1 === class2) {
        console.log("same class");
        return true;
      } else if(class1.isPrototypeOf(class2)) {
        console.log("subClass");
         ;
        // return Object.prototype.isPrototypeOf.call(class1.prototype, class2.prototype);
        return true;
      } else {
        console.log("not like the other");
      }
    }

    console.log("A.isPrototypeOf(A)", A.isPrototypeOf(A));

    console.log("likeTheOtherClasslikeTheOtherClass(A,B)", likeTheOtherClass(A,B));
    console.log("likeTheOtherClass(A,A)", likeTheOtherClass(A,A));

  }

  //test static func
  {
    class A {
      constructor() {
        console.log("A");
      }

      static myFunc(str) {
        console.log("myFunc", str + "aaa");
      }
    }

    // const a = A.myFunc;
    const a = (new A()).constructor.myFunc;
    console.log(a("lolol"));

  }

  //test string/number prototype
  {
    console.log("string prototype", "lol".prototype);
    console.log("string constructor", "lol".constructor);

    // console.log("number prototype", 12.prototype);
    // console.log("number constructor", 12.constructor);
  }

  //test slice
  {
    const animals = ['ant', 'bison', 'camel', 'duck', 'elephant'];
    console.log(animals.slice(1,100));
    console.log(animals.slice(10,100));
  }

  //test fieldsTree
  {
    function subArray(arr, start, end) {
      if (!end) { end = -1; }
      return arr.slice(start, arr.length + 1 - (end * -1));
    }

    function fieldsTree(fieldPathArrays) {
      console.log("fieldsTree", fieldPathArrays);

      const merged = fieldPathArrays.reduce((acc, fieldPathArray) => {
        if(fieldPathArray.length > 1) {
          const first = fieldPathArray[0];
          if(!acc[first]){
            acc[first] = [];
          }
          const rest = subArray(fieldPathArray, 1);
          console.log("rest", rest);
          acc[first].push(rest);
        } else if(fieldPathArray.length == 1) {
          const first = fieldPathArray[0];
          acc[first] = [];
        } else {
          console.log("fieldPathArray.length == 0");
        }
        return acc;
      }, {});
      console.log("merged", merged);

      const tree = Object.entries(merged).reduce((acc, [fieldName, fieldPathArray]) => {
        Object.assign(acc, {[fieldName] : fieldsTree(fieldPathArray)});
        return acc;
      }, {});

      console.log("tree", tree);

      return tree;
    }

    const fieldPathArrays = [
      ["1", "2", "3"],
      ["1", "2", "4"],
      ["1", "5"],
      ["6", "7"],
      ["6", "8", "9"],
      ["10","11","12","13","14","15","16"],
    ];

    console.log("fieldsTree", fieldsTree(fieldPathArrays));

  }

  //test mini
  // testMini();
  // testMiniClone();
  // testMiniAssign();

  //test composed
  // const Composition_tests = require("./utils/composition/tests/Composition_tests.js").Composition_tests;
  // Composition_tests.test_Object();
  // Composition_tests.test_Schema();

  //test computed
  // testComputed();

  //test gemini
  // testGemini_object();
  // testGemini_schema();

  //test computed + gemini
  // testComputedWithGemini();

}

function test1() {
  const onChange = require('on-change');

  const lol = {a : 1, b : 2};
  const watchedLol = onChange(lol, function (path, value, previousValue) {
    console.log("watchedLol::onChange");
  });

  delete watchedLol["b"];
  console.log("watchedLol", watchedLol);
}

function test2() {
  const schema    = require('@colyseus/schema');
  const Schema    = schema.Schema;

  class MySchema extends Schema {
    constructor (str,nb) {
        super();
        this.str = str;
        this.nb  = nb;
    }
  }
  schema.defineTypes(MySchema, {
    str        :  "string",
    nb         :  "number",
  });

  console.log("schema.entries:", Object.entries(MySchema));


  const onChange = require('on-change');

  const mySchema = new MySchema("abc", 123);
  console.log("mySchema.onChange", mySchema.onChange);
  console.log("mySchema.$listeners", mySchema.$listeners);

  const watched = onChange(mySchema, function (path, value, previousValue) {
    console.log("watched::onChange");
  });
  delete watched["str"];
  console.log("watched", watched);

  const FormModel = require("./utils/FormModel.js").FormModel;
  const formModel = new FormModel(mySchema._schema, mySchema);
  console.log("formModel", formModel);
}

function test3() {
  const schema    = require('@colyseus/schema');
  const MapSchema = schema.MapSchema;

  const onChange = require('on-change');

  const mapSchema = new MapSchema();
  mapSchema["a"] = "a";
  mapSchema["b"] = "b";

  const watched = onChange(mapSchema, function (path, value, previousValue) {
    console.log("watched::onChange");
  });
  delete watched["a"];
  console.log("watched", watched);
}

function test4() {
  const schema    = require('@colyseus/schema');
  const MapSchema = schema.MapSchema;

  const onChange = require('on-change');

  class MyClass {
    constructor() {
      this.mapSchema = new MapSchema();
      this.mapSchema["a"] = "a";
      this.mapSchema["b"] = "b";

      this.watched = onChange(this.mapSchema, function (path, value, previousValue) {
        console.log("watched::onChange");
      });
    }

    deleteSomething() {
      delete this.watched["a"];
      console.log("this.watched", this.watched);
    }

  }

  const instance = new MyClass();
  instance.deleteSomething();

}

function test5() {
  const onChange = require('on-change');

  const lol = {a : 1, b : 2};
  const lol2 = {
    c : onChange(lol, function (path, value, previousValue) {
          console.log("watchedLol::onChange");
        }),
    d : 2,
  };

  const watchedLol2 = onChange(lol2, function (path, value, previousValue) {
    console.log("watchedLol2::onChange");
  });

  delete watchedLol2.c["b"];
  console.log("watchedLol2", watchedLol2);
}

function testMini() {

  const mini      = require("./utils/mini/Mini.js").Mini.mini;

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

  const target = new ClassA("a",0,"b",1);

  const miniSel = {
    strA : null,
    b: {
      strB : null,
    }
  };
  const miniObj   = mini(target, miniSel);

  console.log("target", target);
  console.log("miniObj", miniObj);

}

function testMiniClone() {

  const miniClone = require("./utils/mini/Mini.js").Mini.miniClone;

  const fieldsFunc = require("./utils/gemini/Gemini_Object.js").Gemini_Object.fieldsFunc;

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

  const target = new ClassA("a",0,"b",1);

  const miniSel = {
    strA : null,
    b: {
      strB : null,
    }
  };
  const miniCloned   = miniClone(target, fieldsFunc, miniSel);

  console.log("target", target);
  console.log("miniCloned", miniCloned);

}

function testMiniAssign() {

  const miniAssign = require("./utils/mini/Mini.js").Mini.miniAssign;

  const fieldsFunc = require("./utils/gemini/Gemini_Object.js").Gemini_Object.fieldsFunc;

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

  const src = new ClassA("a1",10,"b1",11);
  const dst = new ClassA("a2",20,"b2",21);
  console.log("src", src);
  console.log("dst", dst);

  const miniSel = {
    strA : null,
    b: {
      strB : null,
    }
  };

  miniAssign(dst, src, fieldsFunc, miniSel);
  console.log("src", src);
  console.log("dst", dst);

}

function testComputed() {

  const schema    = require('@colyseus/schema');
  const Schema    = schema.Schema;

  const Computed_Schema = require("./utils/computed/Computed_Schema.js").Computed_Schema;
  const registerComputed = Computed_Schema.registerComputed;
  const FieldFormula     = Computed_Schema.FieldFormula;

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

        registerComputed(this, [
          new FieldFormula("zzz", ["strA", "nbA"], (obj) => {
            return obj.strA + obj.nbA + "zzz";
          }),
          new FieldFormula("pop", ["b"], (obj) => {
            return obj.b.strB + "_pop_" + obj.b.strB;
          }),
        ]);
    }
  }
  schema.defineTypes(SchemaA, {
    strA        : "string",
    nbA         : "number",
    b           : SchemaB,

    //computed
    zzz         : "string",
    pop         : "string",
  });

  const a = new SchemaA("a1", 10, "b2", 20);
  console.log("a", JSON.stringify(a));

  a.strA = "lolilol";
  console.log("a", JSON.stringify(a));

  a.b.nbB = 500;
  console.log("a", JSON.stringify(a));

  a.nbA = 1000;
  console.log("a", JSON.stringify(a));

  a.b.strB = "bbbb";
  console.log("a", JSON.stringify(a));

}

function testGemini_object() {

  const Gemini_Object_tests = require("./utils/gemini/tests/Gemini_Object_tests.js").Gemini_Object_tests;

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

  const target = new ClassA("a",0,"b",1);

  Gemini_Object_tests.test(target);

  //mini
  const miniSel = {
    strA : null,
    b: {
      strB : null,
    }
  };

  Gemini_Object_tests.test_mini(target, miniSel);

}

function testGemini_schema() {

  const Gemini_Schema_tests = require("./utils/gemini/tests/Gemini_Schema_tests.js").Gemini_Schema_tests;

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

  const target = new SchemaA("a",0,"b",1);

  Gemini_Schema_tests.Gemini.test(target);
  Gemini_Schema_tests.Echo.test(target);


  //mini
  const miniSel = {
    strA : null,
    b: {
      strB : null,
    }
  };

  Gemini_Schema_tests.Gemini.test_mini(target, miniSel);
  Gemini_Schema_tests.Echo.test_mini(target, miniSel);

}


function testComputedWithGemini() {

  const Gemini_Schema_tests = require("./utils/gemini/tests/Gemini_Schema_tests.js").Gemini_Schema_tests;

  const schema    = require('@colyseus/schema');
  const Schema    = schema.Schema;

  const Computed_Schema = require("./utils/computed/Computed_Schema.js").Computed_Schema;
  const computed        = Computed_Schema.computed;
  const FieldFormula    = Computed_Schema.FieldFormula;

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

        computed(this, [
          new FieldFormula("zzz", ["strA", "nbA"], (obj) => {
            return obj.strA + obj.nbA + "zzz";
          }),
          new FieldFormula("pop", ["b"], (obj) => {
            if(obj.b) {
              return obj.b.strB + "_pop_" + obj.b.strB;
            } else {
              return "b_is_null";
            }
          }),
        ]);
    }
  }
  schema.defineTypes(SchemaA, {
    strA        : "string",
    nbA         : "number",
    b           : SchemaB,

    //computed
    zzz         : "string",
    pop         : "string",
  });

  const target = new SchemaA("a",0,"b",1);

  Gemini_Schema_tests.test(target);

  // //mini
  // const miniSel = {
  //   strA : null,
  //   b: {
  //     strB : null,
  //   }
  // };
  //
  // Gemini_Schema_tests.test_mini(target, miniSel);

}

exports.debug = debug;
