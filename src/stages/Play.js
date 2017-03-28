import UiQuestionInput from '../ui/questionInput/UiQuestionInput';

export default class StagePlay {

	constructor(g, multiplayer, stages, matmat, spriteSyncUtils, settings, uiLoading) {
		this.g = g;
		this.multiplayer = multiplayer;
		this.stages = stages;
		this.matmat = matmat;
		this.spriteSyncUtils = spriteSyncUtils;
		this.settings = settings;
		this.uiQuestionInput = new UiQuestionInput();
		this.uiLoading = uiLoading;

		this.room = undefined;

		this.mpClient = undefined;
		this.mpData = undefined;
		this.mpRoomsClient = undefined;
		this.mpRoomsData = undefined;

		this.background = undefined;
		this.world = undefined;
		this.player = undefined;
		this.players = undefined;
		this.coins = undefined;
		this.gui = undefined;
	}

	load() {

		this.t = 0;

		if(!this.room) {
			throw new Error("Room id not set!");
		}

		this.background = new PIXI.extras.TilingSprite(this.g.frame(require("../images/ocean.png"), 0, 0, 32, 32), 0, 0);
		this.background.width = this.settings.width;
		this.background.height = this.settings.height;
		this.g.stage.addChild(this.background);

		this.world = this.g.makeTiledWorld(require("../maps/island_large.json"), require("../images/ocean.png"));
		this.coins = this.g.group();
		this.world.addChild(this.coins);
		this.players = this.g.group();
		this.world.addChild(this.players);

		var playerTextures = this.g.filmstrip(require("../images/players.png"), 32, 32);
		var coinTextures = this.g.filmstrip(require("../images/coin.png"), 32, 32);

		this.gui = this.g.group();

		//
		// Coin gui
		//
		let guiCoinRect = this.g.rectangle(120, 37, "#F1F1F1", "#000000", 1, this.settings.width / 2 - 60, -1);
		this.gui.addChild(guiCoinRect);

		let guiMyCoins = new PIXI.Text('0', {font : '21px Helvetica', fill : 0x000000});
		guiMyCoins.x = this.settings.width / 2;
		guiMyCoins.y = 8;
		guiMyCoins.anchor.x = 2.0;
		this.gui.addChild(guiMyCoins);

		let guiAllCoins = new PIXI.Text('0', {font : '21px Helvetica', fill : 0x999999});
		guiAllCoins.x = this.settings.width / 2;
		guiAllCoins.y = 8;
		guiAllCoins.anchor.x = -1.0;
		this.gui.addChild(guiAllCoins);

		let guiCoin = this.g.sprite(coinTextures);
		guiCoin.playAnimation();
		guiCoin.x = this.settings.width / 2 - 16;
		guiCoin.y = 4;
		this.gui.addChild(guiCoin);

		//
		// Controls gui
		//
		let guiBack = this.g.rectangle(100, 37, "#F1F1F1", "#000000", 1, -1, -1);
		guiBack.interactive = true;
		guiBack.buttonMode = true;
		guiBack.defaultCursor = "pointer";
		guiBack.on('click', () => {
			this.stages.changeStage("rooms");
		});
		this.gui.addChild(guiBack);

		let guiBackText = new PIXI.Text('Naspäť', {font : '16px Helvetica', fill : 0x000000});
		guiBackText.x = 8;
		guiBackText.y = 8;
		guiBack.addChild(guiBackText);

		let guiScoreboard = this.g.rectangle(100, 37, "#F1F1F1", "#000000", 1, this.settings.width - 100 + 1, -1);
		guiScoreboard.interactive = true;
		guiScoreboard.buttonMode = true;
		guiScoreboard.defaultCursor = "pointer";
		guiScoreboard.on('click', () => {
			this.stages.getStage("scoreboard").room = this.room;
			this.stages.getStage("scoreboard").source = "play";
			this.stages.changeStage("scoreboard");
		});
		this.gui.addChild(guiScoreboard);

		let guiScoreboardText = new PIXI.Text('Rebríček', {font : '16px Helvetica', fill : 0x000000});
		guiScoreboardText.x = 100 - 8;
		guiScoreboardText.y = 8;
		guiScoreboardText.anchor.x = 1.0;
		guiScoreboard.addChild(guiScoreboardText);

		this.g.stage.addChild(this.gui);

		//
		// Players and coins
		//

		this.mpClient = this.multiplayer.initRoom(this.room);
		this.mpRoomsClient = this.multiplayer.initRoomsRoom();

		var tileproperties = PIXI.loader.resources[require("../maps/island_large.json")].data.tilesets[0].tileproperties;

		var isWorldCollision = (x, y) => {
			let index = y * (this.world.width / this.world.tilewidth) + x;
			let tileId = this.world.getObject("map").data[index] - 1;
			return tileproperties[tileId] && tileproperties[tileId].wall;
		}

		var synced = () => {

			//players
			this.spriteSyncUtils.sync(this.players, this.mpData.players, (dplayer) => {
				let p = this.g.sprite(playerTextures[dplayer.image]);
				p.dplayer = dplayer;

				p.x = this.world.tilewidth * dplayer.x;
				p.y = this.world.tileheight * dplayer.y;

				return p;
			}, (p) => {
				var tx = this.world.tilewidth * p.dplayer.x;
				var ty = this.world.tileheight * p.dplayer.y;

				if(tx !== p.x || ty !== p.y) {
					this.g.slide(p, tx, ty, 10);
				}
			}, (p) => {
				return p.dplayer.id;
			});

			this.spriteSyncUtils.recreate(this.coins, this.mpData.coins, (dcoin) => {
				let c = this.g.sprite(coinTextures);
				c.playAnimation();

				c.x = this.world.tilewidth * dcoin.x;
				c.y = this.world.tileheight * dcoin.y;

				return c;
			});

			if(this.player) {
				guiMyCoins.text = this.player.dplayer.score;
			}
			guiAllCoins.text = this.mpData.coins.length;

			//make sure your player is on top
			this.players.children.sort((a,b) => {
				return a === this.player;
			});

			if(this.mpData.stage === "end") {
				this.stages.getStage("scoreboard").room = this.room;
				this.stages.getStage("scoreboard").source = "end";
				this.stages.changeStage("scoreboard");
			}
		}

		var addMe = () => {

			var p = null;
			for(var i=0; i<this.players.children.length; i++) {
				if(this.players.children[i].dplayer.id === this.mpClient.socket.id) {
					p = this.players.children[i];
				}
			}

			//init
			if(!p.dplayer.hasOwnProperty("x") || !p.dplayer.hasOwnProperty("y") || !p.dplayer.hasOwnProperty("score")) {
				p.dplayer.x = (this.world.worldWidth / this.world.tilewidth) / 2;
				p.dplayer.y = (this.world.worldHeight / this.world.tileheight) / 2;
				p.dplayer.score = 0;
			}

			this.players.addChild(p);

			this.mpClient.sync();

			p.x = this.world.tilewidth * p.dplayer.x;
			p.y = this.world.tileheight * p.dplayer.y;

			this.player = p;

			p.questions = [];
			p.questionsText = [];

			let questionTextFilter = new PIXI.filters.DropShadowFilter();
			questionTextFilter.color = 0x000000;
			questionTextFilter.alpha = 10;
			questionTextFilter.distance = 0;
			questionTextFilter.blur = 4;

			//setup questions
			for(let i=0; i<4; i++) {
				let questionText = new PIXI.Text('', {font : '18px Arial', fill : 0xffffff, align : 'center'});
				questionText.x = Math.cos(Math.PI / 2 * i ) * this.world.tilewidth + (this.world.tilewidth / 2);
				questionText.y = Math.sin(Math.PI / 2 * i ) * this.world.tileheight + (this.world.tileheight / 2);
				questionText.anchor.x = Math.cos(Math.PI / 2 * (-i+2) ) * 0.5 + 0.5;
				questionText.anchor.y = Math.sin(Math.PI / 2 * (-i+2) ) * 0.5 + 0.5;
				questionText.filters = [questionTextFilter];
				p.questionsText[i] = questionText;
				p.addChild(questionText);
			}

			p.changeQuestion = (side) => {
				if(side < 0 || side > 3) {
					throw new Error("Wrong question side "+side);
				}

				let currentAnswers = p.questions
				.filter((q, i) => {return i !== side})
				.map((q) => {return q.answer;});

				let q = this.matmat.getQuestion(currentAnswers);
				p.questions[side] = q;

				p.questionsText[side].text = q.question;
			}

			p.move = (side) => {

				var tx = Math.round((p.x / this.world.tilewidth) + Math.cos(Math.PI / 2 * side ));
				var ty = Math.round((p.y / this.world.tileheight) + Math.sin(Math.PI / 2 * side ));

				if(isWorldCollision(tx, ty)) {
					return;
				}

				p.dplayer.x = tx;
				p.dplayer.y = ty;

				this.mpData.coins = this.mpData.coins.filter((dcoin) => {
					if(tx === dcoin.x && ty === dcoin.y) {
						p.dplayer.score += 1;

						// ga('send', 'event', 'Room', 'collect-coin');

						return false;
					}
					return true;
				});

				this.mpClient.sync();

				p.changeQuestion(side);

				p.questionsText.forEach((questionText, i) => {
					var qx = Math.round(tx + Math.cos(Math.PI / 2 * i));
					var qy = Math.round(ty + Math.sin(Math.PI / 2 * i));
					questionText.visible = !isWorldCollision(qx, qy)
				});
			}

			p.changeQuestions = () => {
				for(let i=0; i<4; i++) {
					p.changeQuestion(i);
				}
			}

			this.uiQuestionInput.show((answer) => {
				for(var i=0; i<p.questions.length; i++) {
					var q = p.questions[i];
					if(answer === q.answer) {
						p.move(i);
						return true;
					}
				}
				return false;
			});

			p.changeQuestions();
		}

		this.mpClient.on('connected', () => {
			this.mpData = this.mpClient.getData();
			synced();
			addMe();
			this.uiLoading.hide();
		});

		if(this.source !== 'end') {
			this.mpClient.on('synced', synced);
		}

		this.mpRoomsClient.on('connected', () => {
			this.mpRoomsData = this.mpRoomsClient.getData();
		});

		this.uiLoading.show();
		this.g.state = this.play.bind(this);
	}

	play() {
		if(this.player) {
			this.world.x = -this.player.x + Math.floor(this.settings.width / 2);
			this.world.y = -this.player.y + Math.floor(this.settings.height / 2);
		}
	}

	unload() {
		this.mpClient.removeAllListeners();
		this.mpRoomsClient.removeAllListeners();

		this.uiQuestionInput.hide();

		this.g.stage.removeChild(this.background);
		this.g.stage.removeChild(this.world);
		this.g.stage.removeChild(this.gui);

		this.mpClient = undefined;
		this.mpData = undefined;

		this.background = undefined;
		this.world = undefined;
		this.player = undefined;
		this.players = undefined;
		this.coins = undefined;
		this.gui = undefined;
	}
}
