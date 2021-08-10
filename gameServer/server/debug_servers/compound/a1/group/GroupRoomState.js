const schema    = require('@colyseus/schema');
const Schema    = schema.Schema;
const MapSchema = schema.MapSchema;
const ArraySchema = schema.ArraySchema;

const GroupPlayerGroup     = require("./game/group/GroupPlayerGroup.js").GroupPlayerGroup;

class GroupRoomState extends Schema {
    constructor () {
        super();

        //serialized
        this.group = null;
    }
}
schema.defineTypes(GroupRoomState, {

  group : GroupPlayerGroup,

});

exports.GroupRoomState = GroupRoomState;
