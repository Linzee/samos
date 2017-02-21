import UiRooms from '../ui/rooms/UiRooms';

export default class StageRooms {

	constructor(g, multiplayer, stages, spriteSyncUtils, errorDialog) {
		this.g = g;
		this.multiplayer = multiplayer;
		this.stages = stages;
		this.spriteSyncUtils = spriteSyncUtils;
		this.errorDialog = errorDialog;
		this.uiRooms = new UiRooms(g);

		this.mpClient = undefined;
		this.mpData = undefined;

		this.roomStates = {
			'lobby': 0,
			'play': 1,
			'end': 2
		}
	}

	load() {

		this.mpClient = this.multiplayer.initRoomsRoom();

		var crateRoom = (createName) => {
			if(!Array.isArray(this.mpData)) {
				return; //Not connected yet.
			}

			let randomId = (Math.random().toString(36)+'00000000000000000').slice(2, 8);
			
			this.mpData.push({'id': randomId, 'name': createName, 'state': 'lobby'});
			this.mpClient.sync();

			this.stages.getStage("lobby").room = randomId;
			this.stages.changeStage("lobby");

			ga('send', 'event', 'Room', 'create');
		};

		this.uiRooms.show(crateRoom);

		var synced = () => {

			var rooms = this.mpData.map(droom => {
				return {
					id: droom.id,
					name: droom.name,
					action: () => {
						this.stages.getStage("lobby").room = droom.id;
						this.stages.changeStage("lobby");

						ga('send', 'event', 'Room', 'join');
					},
					state: droom.state
				}
			});

			rooms.sort((a, b) => {
				var u = this.roomStates[a.state] - this.roomStates[b.state];
				if(u !== 0) {
					return u;
				}
				return a.name.localeCompare(b.name);
			});

			this.uiRooms.updateRooms(rooms);
		}

		this.mpClient.on('connected', () => {
			this.mpData = this.mpClient.getData();
			synced();
		});

		this.mpClient.on('synced', synced);

		this.mpClient.on('error', () => {
			this.errorDialog.show("Connection problem!");
		});

		this.g.state = this.play;
	}

	play() {

	}

	unload() {

		this.mpClient.removeAllListeners();

		this.uiRooms.hide();

		this.mpClient = undefined;
		this.mpData = undefined;
	}
}