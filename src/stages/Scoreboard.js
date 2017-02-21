export default class StageScoreboard {

	constructor(g, multiplayer, stages, spriteSyncUtils, errorDialog, settings) {
		this.g = g;
		this.multiplayer = multiplayer;
		this.stages = stages;
		this.spriteSyncUtils = spriteSyncUtils;
		this.errorDialog = errorDialog;
		this.settings = settings;

		this.room = undefined;
		this.backStage = "lobby";

		this.mpClient = undefined;
		this.mpData = undefined;

		this.players = undefined;
		this.roomName = undefined;
		this.gui = undefined;

		this.startTime = undefined;

		this.bgColors = ['#FFDF00', '#EEEEEE', '#FFE84C', '#EEEEEE', '#FFEC6F', '#EEEEEE', '#FFF19A', '#EEEEEE'];
	}

	load() {
		var playerTextures = this.g.filmstrip(require("../images/players.png"), 32, 32);

		this.players = this.g.group();

		if(!this.room) {
			throw new Error("Room id not set!");
		}

		this.mpClient = this.multiplayer.initRoom(this.room);
		
		var synced = () => {

			if(this.players === undefined) {
				return; //Synced when already left this state, ignore
			}
			
			if(this.mpData.name) { //room name
				this.roomName.text = this.mpData.name;
			}

			this.mpData.players.sort((a, b) => {
				return b.score - a.score;
			});

			var nextX = 0;

			this.spriteSyncUtils.recreate(this.players, this.mpData.players, (player, i) => {
				let p = new PIXI.Container();

				var size = i < 3 ? (3-i)*2*32 : 32;

				p.x = nextX;
				nextX = nextX + size + 16;
				
				let pBg = this.g.rectangle(size + 16, this.settings.height, this.bgColors[i], "#000000", 0, 0, 0);
				p.addChild(pBg);

				if(player.image) {
					let pImage = this.g.sprite(playerTextures[player.image]);
					pImage.width = size;
					pImage.height = size;
					pImage.anchor.x = 0.5;
					pImage.anchor.y = 1.0;
					pImage.x = size / 2 + 8;
					pImage.y = this.settings.height - 132;
					p.addChild(pImage);
				}

				let pPos = new PIXI.Text((i+1)+".", {font : '16px Helvetica', fill : 0x111111});
				pPos.anchor.x = 0.5;
				pPos.x = size / 2 + 8;
				pPos.y = 32;
				p.addChild(pPos);

				let pScore = new PIXI.Text(player.score, {font : '21px Helvetica', fill : 0x111111});
				pScore.anchor.x = 0.5;
				pScore.anchor.y = 1.0;
				pScore.x = size / 2 + 8;
				pScore.y = this.settings.height - 100;
				p.addChild(pScore);

				return p;
			});

			this.g.stage.putCenter(this.players);
		};

		this.mpClient.on('connected', () => {
			this.mpData = this.mpClient.getData();
			synced();
			this.g.stage.visible = true; //loaded
		});

		this.mpClient.on('synced', synced);

		this.mpClient.on('error', () => {
			this.errorDialog.show("Connection problem!");
		});

		this.roomName = new PIXI.Text("", {font : '12px Helvetica', fill : 0x111111});
		this.roomName.x = 16;
		this.roomName.y = 16;

		//
		// Controls gui
		//
		this.gui = this.g.group();

		if(this.backStage) {
			let guiBack = this.g.rectangle(100, 37, "#F1F1F1", "#000000", 1, -1, -1);
			guiBack.interactive = true;
			guiBack.buttonMode = true;
			guiBack.defaultCursor = "pointer";
			guiBack.on('click', () => {
				this.stages.changeStage(this.backStage);
			});
			this.gui.addChild(guiBack);

			let guiBackText = new PIXI.Text('Back', {font : '16px Helvetica', fill : 0x000000});
			guiBackText.x = 8;
			guiBackText.y = 8;
			guiBack.addChild(guiBackText);
		}

		this.g.stage.visible = false; //loading
		this.g.state = this.play;
	}

	unload() {
		this.mpClient.removeAllListeners();

		this.g.stage.removeChild(this.players);
		this.g.stage.removeChild(this.roomName);
		this.g.stage.removeChild(this.gui);

		this.mpClient = undefined;
		this.mpData = undefined;

		this.players = undefined;
		this.roomName = undefined;
		this.gui = undefined;
	}

	play() {

	}
}