export default class StageLobby {

	constructor(g, multiplayer, stages, settings, uiLoading, uiError) {
		this.g = g;
		this.multiplayer = multiplayer;
		this.stages = stages;
		this.settings = settings;
		this.uiLoading = uiLoading;
		this.uiError = uiError;
		
		this.room = undefined;
		this.maxPlayers = settings.app.maxPlayers;

		this.mpClient = undefined;
		this.mpData = undefined;
		this.mpRoomsClient = undefined;
		this.mpRoomsData = undefined;

		this.dplayer = undefined;
		this.players = undefined;
		this.gui = undefined;
		this.guiCountdown = undefined;
	}

	load() {

		this.t = 0;

		if(!this.room) {
			throw new Error("Room id not set!");
		}

		//
		// Gui
		//
		this.gui = this.g.group();

		let guiPlayers = new PIXI.Text('Hráči: ', {font : '21px Helvetica', fill : 0x000000});
		guiPlayers.x = this.settings.width / 2;
		guiPlayers.y = 8;
		guiPlayers.anchor.x = 0.5;
		this.gui.addChild(guiPlayers);

		this.guiCountdown = new PIXI.Text('', {font : '21px Helvetica', fill : 0x999999});
		this.guiCountdown.x = this.settings.width / 2;
		this.guiCountdown.y = this.settings.height - 8;
		this.guiCountdown.anchor.x = 0.5;
		this.guiCountdown.anchor.y = 1.0;
		this.gui.addChild(this.guiCountdown);

		//
		// Players 
		//
		this.mpClient = this.multiplayer.initRoom(this.room);
		this.mpRoomsClient = this.multiplayer.initRoomsRoom();

		var playerTextures = this.g.filmstrip(require("../images/players.png"), 32, 32);

		this.players = this.g.group();

		let selectedPlayerFilter = new PIXI.filters.DropShadowFilter();
		selectedPlayerFilter.color = 0xFFDF00;
		selectedPlayerFilter.alpha = 10;
		selectedPlayerFilter.distance = 0;
		selectedPlayerFilter.blur = 4;

		for(var i = 0; i<playerTextures.length; i++) {
			let p = this.g.sprite(playerTextures[i]);

			p.x = (i % 5) * 48;
			p.y = Math.floor(i / 5) * 48;

			p.interactive = true;
			p.buttonMode = true;
			p.defaultCursor = "pointer";
			p.on('click', ((i) => {
				return () => {
					this.dplayer.image = i;
					this.mpClient.sync();
				}
			})(i));

			this.players.addChild(p);
		}

		this.g.stage.putCenter(this.players);

		var initialiseGame = () => {
			if(!this.mpData) {
				this.mpData = {};
			}
			if(!this.mpData.players) {
				this.mpData.players = [];
				this.mpData.stage = "lobby";
				this.mpClient.sync();
			}
		};

		var synced = () => {

			initialiseGame();

			//players
			var pimgs = {};
			for(var i = 0; i<this.mpData.players.length; i++) {
				if(this.mpData.players[i].image !== undefined) {
					pimgs[this.mpData.players[i].image] = this.mpData.players[i];
				}
			}

			for(i = 0; i<playerTextures.length; i++) {
				var p = this.players.children[i];
				p.alpha = 1.0;
				p.interactive = true;
				p.filters = undefined;

				if(pimgs[i]) {
					p.alpha = 0.2;
					p.interactive = false;
					if(this.dplayer && pimgs[i].id === this.dplayer.id) {
						p.filters = [selectedPlayerFilter];
					}
				}
			}

			guiPlayers.text = "Hráči: "+this.mpData.players.length+" / "+this.maxPlayers;

			this.guiCountdown.text = this.mpData.countdown ? "Hra začína o " + this.mpData.countdown : "";

			if(this.mpData.stage === "play") {
				if(this.dplayer) {
					ga('send', 'event', 'Room', 'play', this.dplayer.image);
				}

				this.stages.getStage("play").room = this.room;
				this.stages.changeStage("play");

				return;
			}
			if(this.mpData.stage === "end") {
				this.stages.getStage("scoreboard").room = this.room;
				this.stages.getStage("scoreboard").source = "end";
				this.stages.changeStage("scoreboard");
				return;
			}
		};

		var addMe = () => {

			for(var i=0; i<this.mpData.players.length; i++) {
				if(this.mpData.players[i].id === this.mpClient.socket.id) {
					//player is already in game
					this.stages.getStage("play").room = this.room;
					this.stages.changeStage("play");
					return;
				}
			}

			this.dplayer = {
				id: this.mpClient.socket.id,
				image: undefined
			};

			initialiseGame();
			this.mpData.players.push(this.dplayer);
			this.mpClient.sync();
		}

		this.mpClient.on('connected', () => {
			this.mpData = this.mpClient.getData();

			if(this.mpData.players && this.mpData.players.length >= this.maxPlayers) {
				this.stages.changeStage("rooms");
				this.uiError.show("Táto miestnosť je už plná");
				return;
			}

			synced();
			addMe();

			this.uiLoading.hide();
		});

		this.mpClient.on('synced', synced);

		this.mpRoomsClient.on('connected', () => {
			this.mpRoomsData = this.mpRoomsClient.getData();
		});

		this.uiLoading.show();
		this.g.state = this.play.bind(this);
	}

	play() {
		
	}

	unload() {

		this.mpClient.removeAllListeners();
		this.mpRoomsClient.removeAllListeners();

		this.g.stage.removeChild(this.players);
		this.g.stage.removeChild(this.gui);

		this.mpClient = undefined;
		this.mpData = undefined;

		this.dplayer = undefined;
		this.players = undefined;
		this.gui = undefined;
		this.guiCountdown = undefined;

		this.countdown = undefined;
	}
}
