var bot = require('./bot');

module.exports = function(dsi, pathfinder) {

	this.bots = {};
	this.botsThinkSpeed = {
		low: 500,
		high: 5500
	};

	this.spawn = function(room, botName) {
		if(this.bots[room] === undefined) {
			this.bots[room] = [];
		}
		this.bots[room].push(new bot(dsi, room, botName, pathfinder, this.botsThinkSpeed));
	}.bind(this)

	setInterval(function(){
		Object.keys(this.bots).forEach(function(room) {
			this.bots[room].forEach(function(bot) {
				bot.move();
			});
		}.bind(this));
	}.bind(this), 250);

	this.despawn = function(room, botName) {
		if(this.bots[room] === undefined) {
			return;
		}
		this.bots[room] = this.bots[room].filter(function(bot){
			return !(botName === undefined || botName === bot.botName);
		});
		if(this.bots[room].length == 0) {
			delete this.bots[room];
		}
	}.bind(this);

}