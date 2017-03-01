import Stages from './common/Stages';
import Multiplayer from './common/Multiplayer';
import MatMatData from './common/MatMatData';
import StageRooms from './stages/Rooms';
import StageLobby from './stages/Lobby';
import StagePlay from './stages/Play';
import Scoreboard from './stages/Scoreboard';
import SpriteSyncUtils from './common/SpriteSyncUtils';
import ErrorDialog from './common/ErrorDialog';
import UiLoading from './ui/loading/UiLoading';

export default class App {

	constructor(settings) {
		this.hexi = hexi;

		PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

		this.settings = settings;
		this.stages = new Stages();
		this.multiplayer = new Multiplayer(this.settings);
		this.matmat = new MatMatData();
		this.spriteSyncUtils = new SpriteSyncUtils();

		this.g = hexi(settings.width, settings.height, this.onLoad.bind(this), settings.toLoad);

		this.errorDialog = new ErrorDialog(this.g);

		this.uiLoading = new UiLoading();

		this.stages.addStage("rooms", new StageRooms(this.g, this.multiplayer, this.stages, this.spriteSyncUtils, this.errorDialog, this.uiLoading));
		this.stages.addStage("lobby", new StageLobby(this.g, this.multiplayer, this.stages, this.errorDialog, settings, this.uiLoading));
		this.stages.addStage("play", new StagePlay(this.g, this.multiplayer, this.stages, this.matmat, this.spriteSyncUtils, this.errorDialog, settings, this.uiLoading));
		this.stages.addStage("scoreboard", new Scoreboard(this.g, this.multiplayer, this.stages, this.spriteSyncUtils, this.errorDialog, settings, this.uiLoading));

		this.g.scaleToWindow(document.querySelector("#ui"));
	}

	onLoad() {
		if(window.location.hash.startsWith("#play-")) {
			this.stages.getStage("lobby").room = window.location.hash.substr(6);
			this.stages.changeStage("lobby");
		} else if(window.location.hash.startsWith("#scoreboard-")) {
			this.stages.getStage("scoreboard").room = window.location.hash.substr(12);
			this.stages.changeStage("scoreboard");
		} else {
			this.stages.changeStage("rooms");
		}
	}

	start() {
		if(!this.settings.fullpage) {
			this.g.scaleToWindow("black");
		}
		this.g.start();
	}

}