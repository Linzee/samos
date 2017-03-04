var bot = require('./bot');

module.exports = function(dsi, pathfinder) {

	this.bots = [];
	this.botsThinkSpeed = {
		low: 500,
		high: 5500
	};

	this.create = function(room, botName) {
		this.bots.push(new bot(dsi, room, botName, pathfinder, this.botsThinkSpeed));
	}.bind(this)

	setInterval(function(){
		this.bots.forEach(function(bot) {
			bot.move();
		});
	}.bind(this), 100);

}