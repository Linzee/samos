export default class ErrorDialog {

	constructor(g) {
		this.g = g;

		this.width = 500;
		this.height = 200;
	}

	show(message) {

		console.log("Error dialog opened: "+message);

		var self = this;

		var dialog = self.g.group();

		let background = self.g.rectangle(self.width, self.height, "#F1F1F1", "#000000", 1);
		background.anchor.x = 0.5;
		background.anchor.y = 0.5;
		dialog.addChild(background);

		let messageText = new PIXI.Text(message, {font : '16px Helvetica', fill : 0x000000, 'align': 'center', wordWrap: true, wordWrapWidth: self.width - 32});
		messageText.anchor.x = 0.5;
		messageText.anchor.y = 0.5;
		dialog.addChild(messageText);

		let buttonOk = new PIXI.Text('Ok', {font : '21px Helvetica', fill : 0x999999});
		buttonOk.y = self.height/2 - 16;
		buttonOk.anchor.x = 0.5;
		buttonOk.anchor.y = 1.0;
		buttonOk.interactive = true;
		buttonOk.buttonMode = true;
		buttonOk.defaultCursor = "pointer";
		buttonOk.on('click', ((dialog) => {
			return () => {
				self.g.stage.removeChild(dialog);
			};
		})(dialog));
		dialog.addChild(buttonOk);

		self.g.stage.putCenter(dialog);
	}
}