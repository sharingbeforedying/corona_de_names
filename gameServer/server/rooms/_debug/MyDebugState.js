const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;

class Schema1 extends Schema {
  constructor (str) {
      super();
      this.str = str;
  }
}
schema.defineTypes(Schema1, {
  str : "string",
});

class Schema2 extends Schema1 {
  constructor (num, str) {
      super(str);
      this.num = num;
  }
}
schema.defineTypes(Schema2, {
  num : "number",
});



class MyDebugState extends Schema {
  constructor (obj) {
      super();
      this.obj = obj;
  }

  static using_schema2() {
    return new MyDebugState(new Schema2(2, "debug"));
  }
}
schema.defineTypes(MyDebugState, {
  //obj : Schema,
  obj : Schema1,
});

exports.MyDebugState = MyDebugState;
