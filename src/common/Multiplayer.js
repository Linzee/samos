import {Client} from '../../lib/diffsync';
import io from 'socket.io-client';

export default class Multiplayer {

	constructor(settings, errorCallback) {
		this.connection = io(settings.app.mpServer);
		this.errorCallback = errorCallback;

		this.roomsRoomClient = undefined;

		this.roomId = undefined;
		this.roomClient = undefined;
	}

	initRoomsRoom() {
		if(this.roomsRoomClient) {
			setTimeout(() => {
				this.roomsRoomClient.emit('connected');
			});
			
			return this.roomsRoomClient;
		} else {
			this.roomsRoomClient = new Client(this.connection, "__rooms__");

			if(this.errorCallback) {
				this.roomsRoomClient.on('error', this.errorCallback);
			}

			this.roomsRoomClient.initialize();
			
			return this.roomsRoomClient;
		}
	}

	initRoom(room) {
		if(this.roomClient && room === this.roomId) {
			setTimeout(() => {
				this.roomClient.emit('connected');
			});
			
			return this.roomClient;
		} else {
			if(this.roomClient) {
				this.roomClient.close();
			}
			this.roomId = room;
			this.roomClient = new Client(this.connection, room);

			if(this.errorCallback) {
				this.roomsRoomClient.on('error', this.errorCallback);
			}
			
			this.roomClient.initialize();

			return this.roomClient;
		}
	}
}