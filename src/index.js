import App from './App';

import './style/app.scss';

window.samos = function() {
	var settings = {
		width: 990,
		height: 640,
		fullpage: false,
		toLoad: [
		require("./images/players.png"),
		require("./images/ocean.png"),
		require("./images/coin.png"),
		require("./maps/island_large.json")
		],
		app: require('./config.json')
	}

	if(settings.fullpage) {
		settings.width = window.innerWidth;
		settings.height = window.innerHeight;
	}

	var samos = new App(settings);
	samos.start();
}
