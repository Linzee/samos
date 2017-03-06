export default class UiLoading {

	constructor(g) {
		var globalUi = document.querySelector("#ui");
		
		this.ui = document.createElement('div');
		this.ui.className = 'ui-loading';
		globalUi.appendChild(this.ui);
	}

	show(createRoomCallback) {
		this.ui.innerHTML = require("./template.html");
	}

	hide() {
		this.ui.innerHTML = "";
	}
}
