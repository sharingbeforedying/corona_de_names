const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;


/*
  This Schema definition is partial,
  it is completed when ClientState is instantiated by serverState
*/

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

class SchemaC extends SchemaA {
  constructor (strC, strA,nbA,strB,nbB) {
      super(strA,nbA,strB,nbB);
      this.strC = strC;
  }
}
schema.defineTypes(SchemaC, {
  strC        : "string",

  m : {map : "string"},
  ar: [ "number" ],

});

function tracePrototypeChainOf(object) {

    var proto = object.constructor.prototype;
    var result = '';

    while (proto) {
        result += ' -> ' + proto.constructor.name;
        proto = Object.getPrototypeOf(proto)
    }

    return result;
}

// function createProxy(value) {
//   const proxy = new Proxy(value, {
//       get: function (obj, prop) {
//         console.log("proxy get", prop);
//         return obj[prop];
//       },
//       set: function (obj, prop, setValue) {
//           console.log("forward set to gemini source");
//           if(obj._schema[prop]) {
//             console.log("setting _schema[", prop, "]");
//           }
//           else {
//             console.log("legacy set", prop /*,setValue*/ );
//             obj[prop] = setValue;
//           }
//           return true;
//       },
//       // lol : function(obj) {
//       //   console.log("lolilol");
//       // },
//   });
//   return proxy;
// }


class ParentClientRoomState extends Schema {
    constructor () {
        super();

        //serialized
        this.name          = "parent_client_name";
        this.parentSpecial = "abc123";

        // this.availableCommands = new ArraySchema();
        // this.availableServers  = new MapSchema();

        this.a = new SchemaC("c", "a", 1, "b", 2);

        const Gemini_Schema = require("../../utils/gemini/Gemini_Schema.js").Gemini_Schema;
        // this.a_echo = Gemini_Schema.createEcho(this.a);
        // this.a_gemini = Gemini_Schema.createGemini(this.a);
        // console.log("this.a_gemini", this.a_gemini);

        this.mapmap = new MapSchema();
        this.mapmap["123"] = "initial_1_2_3";

        // const c = new SchemaC();
        // console.log("c", c);
        // console.log("tracePrototypeChainOf(c)", tracePrototypeChainOf(c));

        // this.c = createProxy(new SchemaC("ccc", "aaaa", 111, "bbb", 222));
        // c.lol();

        const c = new SchemaC("ccc", "aaaa", 111, "bbb", 222);
        c.m  = new MapSchema({lol : "lolilol", pop: "popip"});

        this.cSource = Gemini_Schema.createSource(c);
        this.cSource.strC = "c1111";
        console.log("JSON.stringify(this.cSource)", JSON.stringify(this.cSource));

        this.cGemini = Gemini_Schema.createGemini(this.cSource);
        console.log("JSON.stringify(this.cGemini)", JSON.stringify(this.cGemini));

        this.cEcho   = Gemini_Schema.createEcho(this.cSource);

        this.cSource.strC = "c2222";
        console.log("JSON.stringify(this.cSource)", JSON.stringify(this.cSource));
        console.log("JSON.stringify(this.cGemini)", JSON.stringify(this.cGemini));
        console.log("JSON.stringify(this.cEcho)", JSON.stringify(this.cEcho));


        this.cGemini.strC = "cGGGG";
        console.log("JSON.stringify(this.cSource)", JSON.stringify(this.cSource));
        console.log("JSON.stringify(this.cGemini)", JSON.stringify(this.cGemini));
        console.log("JSON.stringify(this.cEcho)", JSON.stringify(this.cEcho));


        this.cSource.b.strB = "bSSSSS";
        console.log("JSON.stringify(this.cSource)", JSON.stringify(this.cSource));
        console.log("JSON.stringify(this.cGemini)", JSON.stringify(this.cGemini));
        console.log("JSON.stringify(this.cEcho)", JSON.stringify(this.cEcho));


        this.cGemini.b.strB = "bGGGGG";
        console.log("JSON.stringify(this.cSource)", JSON.stringify(this.cSource));
        console.log("JSON.stringify(this.cGemini)", JSON.stringify(this.cGemini));
        console.log("JSON.stringify(this.cEcho)", JSON.stringify(this.cEcho));



        this.cGeminiGemini = Gemini_Schema.createGemini(this.cGemini);
        this.cEchoGemini   = Gemini_Schema.createEcho(this.cGemini);

        this.cEchoEcho     = Gemini_Schema.createEcho(this.cEcho);


        this.cGeminiGemini.b.nbB = 777000777000777;

        this.cSource.b       = new SchemaB("newB_from_source", 1010);
        this.cGemini.b       = new SchemaB("newB_from_gemini", 2020);
        this.cGeminiGemini.b = new SchemaB("newB_from_gemini_gemini", 4040);


        console.log("tracePrototypeChainOf(new ArraySchema())", tracePrototypeChainOf(new ArraySchema()));
        console.log("tracePrototypeChainOf(new MapSchema())",   tracePrototypeChainOf(new MapSchema()));

        this.cSource.m  = new MapSchema({lol : "lolilol", pop: "popip"});

        this.cGemini.m["power"] = "unlimited";

        this.cGeminiGemini.ar = new ArraySchema(1,2,3,4,5);

        this.cGemini.ar.push(...[6,6,6]);



        // this.mx  = new MapSchema({lol : "lolilol", pop: "popip"});
        // this.arx = new ArraySchema(1,2,3,4,5);
        // this.mx  = new MapSchema();
        // this.mx["lol"] = "lolilol";
        // this.mx["pop"] = "popip";
        //
        // this.arx = new ArraySchema();
        // this.arx.push(...[1,2,3,4,5]);
        //
        //   //later
        // // this.<gameState> = null;
        //
        // console.log("c", c);
        // console.log("c.m", c.m);
        // console.log("c.m.$changes", c.m.$changes);

        // const mapSchemaInstance = new MapSchema();
        // mapSchemaInstance["test"] = "tieste";
        // console.log("mapSchemaInstance", mapSchemaInstance);
        // console.log("mapSchemaInstance.$changes", mapSchemaInstance.$changes);
        // mapSchemaInstance["toast"] = "taste";
        // console.log("mapSchemaInstance.$changes", mapSchemaInstance.$changes);
        //
        //
        // const arraySchemaInstance = new ArraySchema();
        // arraySchemaInstance.push(...[123,456,789]);
        // console.log("arraySchemaInstance", arraySchemaInstance);
        // console.log("arraySchemaInstance.$changes", arraySchemaInstance.$changes);


    }

}
schema.defineTypes(ParentClientRoomState, {
  name: "string",
  parentSpecial : "string",

  a : SchemaA,
  // a_echo   : SchemaA,
  // a_gemini : SchemaA,

  mapmap : { map : "string" },

  // availableCommands: [ "string" ],
  // availableServers : { map : "string" },

  // c : SchemaC,

  cSource : SchemaC,
  cGemini : SchemaC,
  cEcho   : SchemaC,

  cGeminiGemini : SchemaC,
  cEchoGemini   : SchemaC,

  cEchoEcho : SchemaC,

  mx : {map : "string"},
  arx: [ "number" ],

    //later
  //<gameState> : <ClientGameState>
});

exports.ParentClientRoomState = ParentClientRoomState;
