export default class StageScoreboard {

	constructor(g, multiplayer, stages, spriteSyncUtils, settings, uiLoading) {
		this.g = g;
		this.multiplayer = multiplayer;
		this.stages = stages;
		this.spriteSyncUtils = spriteSyncUtils;
		this.settings = settings;
		this.uiLoading = uiLoading;

		this.room = undefined;
		this.source = "standalone";

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
			
			if(this.mpData.name) { //room name
				this.roomName.text = this.mpData.name;
			}

			var dplayers = this.mpData.players;

			dplayers.sort((a, b) => {
				return b.score - a.score;
			});

			var nextX = 0;

			this.spriteSyncUtils.recreate(this.players, dplayers, (player, i) => {
				let p = new PIXI.Container();

				var size = i < 3 ? (3-i)*2*32 : 32;

				p.x = nextX;
				nextX = nextX + size + 16;
				
				let pBg = this.g.rectangle(size + 16, this.settings.height, this.bgColors[i], "#000000", 0, 0, 0);
				p.addChild(pBg);

				if(player.image !== undefined) {
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
			this.uiLoading.hide();
		});

		this.mpClient.on('synced', synced); 

		this.roomName = new PIXI.Text("", {font : '12px Helvetica', fill : 0x111111});
		this.roomName.x = 16;
		this.roomName.y = 16;

		//
		// Controls gui
		//
		this.gui = this.g.group();

		
		let guiBack = this.g.rectangle(100, 37, "#F1F1F1", "#000000", 1, -1, -1);
		guiBack.interactive = true;
		guiBack.buttonMode = true;
		guiBack.defaultCursor = "pointer";
		guiBack.on('click', () => {
			this.stages.changeStage(this.source === 'play' ? 'play' : 'rooms');
		});
		this.gui.addChild(guiBack);

		let guiBackText = new PIXI.Text('Naspäť', {font : '16px Helvetica', fill : 0x000000});
		guiBackText.x = 8;
		guiBackText.y = 8;
		guiBack.addChild(guiBackText);


		if(this.source === 'end') {
			let guiNewGame = this.g.rectangle(300, 32, "#F1F1F1", "#000000", 1, this.settings.width / 2, this.settings.height - 48);
			guiNewGame.anchor.x = 0.5;
			guiNewGame.anchor.y = 0.5;
			guiNewGame.interactive = true;
			guiNewGame.buttonMode = true;
			guiNewGame.defaultCursor = "pointer";
			guiNewGame.on('click', () => {
				this.stages.changeStage('rooms');
			});
			this.gui.addChild(guiNewGame);

			let guiNewGameText = new PIXI.Text('Nová hra', {font : '21px Helvetica', fill : 0x000000});
			guiNewGameText.anchor.x = 0.5;
			guiNewGameText.anchor.y = 0.5;
			guiNewGame.addChild(guiNewGameText);
		}

		this.uiLoading.show();
		this.g.state = this.play;
	}

	play() {

	}	

	unload() {
		this.mpClient.removeAllListeners();
		// this.mpRoomsClient.removeAllListeners();

		this.g.stage.removeChild(this.players);
		this.g.stage.removeChild(this.roomName);
		this.g.stage.removeChild(this.gui);

		this.mpClient = undefined;
		this.mpData = undefined;

		this.players = undefined;
		this.roomName = undefined;
		this.gui = undefined;
	}
}
