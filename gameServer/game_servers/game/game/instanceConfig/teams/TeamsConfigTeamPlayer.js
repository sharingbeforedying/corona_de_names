
const schema = require('@colyseus/schema');
const Schema = schema.Schema;

const InstancePlayerRole = require('../../instance/InstancePlayerRole.js').InstancePlayerRole;

class TeamsConfigTeamPlayer extends Schema {
  constructor (id) {
      super();
      this.id     = id;

      this.roles = InstancePlayerRole.rolesMap();
      this.role  = (Object.values(this.roles)).find(e => true).copy();

      this.ready = false;
  }

  updateRole(roleId) {
    this.role = this.roles[roleId].copy();
  }
}
schema.defineTypes(TeamsConfigTeamPlayer, {
  id        :  "string",

  roles     :  {map : InstancePlayerRole},
  role      :  InstancePlayerRole,

  ready     :  "boolean",

});

exports.TeamsConfigTeamPlayer = TeamsConfigTeamPlayer;
