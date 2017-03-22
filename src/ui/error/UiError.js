export default class UiRooms {

	constructor(g) {
		var globalUi = document.querySelector("#game-ui");

		this.ui = document.createElement('div');
		this.ui.className = 'ui-error';
		globalUi.appendChild(this.ui);
	}

	show(message) {
		var temp = require("./template.html");
		temp = temp.replace("{{message}}", message);
		this.ui.innerHTML = temp;
		this.ui.querySelector(".error button").addEventListener('click', this.hide.bind(this));
	}

	hide() {
		this.ui.innerHTML = "";
	}
}
