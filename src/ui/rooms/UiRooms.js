export default class UiRooms {

	constructor() {
		var globalUi = document.querySelector("#ui");
		
		this.ui = document.createElement('div');
		this.ui.className = 'ui-rooms';
		globalUi.appendChild(this.ui);
	}

	show(createRoomCallback) {
		this.ui.innerHTML = require("./template.html");

		var createRoom = this.ui.querySelector("#formCreateRoom");
		var createRoomName = createRoom.querySelector("input[name=\"name\"]");
		createRoom.addEventListener("submit", (e) => {
			e.preventDefault();
			createRoomCallback(createRoomName.value);
		});
	}

	updateRooms(drooms) {
		var rooms = this.ui.querySelector("#rooms");
		rooms.innerHTML = "";

		if(drooms.length > 0) {
			drooms.forEach((droom) => {
				var template = document.createElement('template');
				var temp = require("./templateRow.html");
				temp = temp.replace("{{name}}", droom.name);
				temp = temp.replace("{{stage}}", droom.stageName);
				// temp = temp.replace("{{action}}", droom.);
				template.innerHTML = temp;
				var row = template.content.firstChild;

				row.addEventListener("click", droom.action);

				row.querySelector("button").disabled = droom.state !== 'lobby';

				rooms.appendChild(row);
			});
		} else {
			var template = document.createElement('template');
			var temp = require("./templateNoRooms.html");
			template.innerHTML = temp;
			var row = template.content.firstChild;
			rooms.appendChild(row);
		}
	}

	hide() {
		this.ui.innerHTML = "";
	}
}
