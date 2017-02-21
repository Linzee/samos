import App from './App';

import './style/app.scss';

var settings = {
	width: 512,
	height: 384,
	fullpage: true,
	toLoad: [
	require("./images/players.png"),
	require("./images/ocean.png"),
	require("./images/coin.png"),
	require("./maps/island_large.json")
	]
}

if(settings.fullpage) {
	settings.width = window.innerWidth;
	settings.height = window.innerHeight;
}

window.app = new App(settings);
window.app.start();