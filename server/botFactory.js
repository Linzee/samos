var bot = require('./bot');

module.exports = function(dsi, clientAddress) {
    
	this.bots = [];

    this.create = function(room, botName) {
        this.bots.push(new bot(dsi, room, botName));
    }.bind(this)

    setInterval(function(){
    	this.bots.forEach(function(bot) {
    		bot.move();
    	});
    }.bind(this), 1000);

}