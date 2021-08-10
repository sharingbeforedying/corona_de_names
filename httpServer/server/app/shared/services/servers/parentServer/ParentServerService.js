import { ServerService } from '../ServerService.js';

import { RoomConnectionService } from '../RoomConnectionService.js';

import { WelcomeRoomService } from './rooms/WelcomeRoomService.js';
import { ClientRoomService }  from './rooms/ClientRoomService.js';

export class ParentServerService extends ServerService {

  constructor(name) {
    super(name);

  }

}
