export default class Stages {

	constructor() {
		this.current = undefined;
		this.list = [];
	}
	
	addStage(name, stage) {
		this.list[name] = stage;
	}

	changeStage(name) {
		if(!this.list[name]) {
			throw new Error("Illegal stage name.");
		}
		if(this.current !== undefined) {
			this.current.unload();
		}
		this.current = this.list[name];
		this.current.load();
	}

	getStage(name) {
		return this.list[name];
	}
}

/*
Stage interface:
{
	load = function()
	unload = function()
	play = function()
}
*/