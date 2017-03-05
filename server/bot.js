var range = require('range').range;

module.exports = function(dsi, room, botName, pathfinder, thinkSpeedRange) {

	console.log("Bot "+botName+" joined "+room);

	this.botName = botName;
	this.sleep = 0;
	this.path = undefined;

	//spawn
	dsi.getData(room, function(data) {
		var leftImages = range(27);
		
		data.players.forEach(function(dplayer) {
			leftImages.splice(leftImages.indexOf(dplayer.image), 1);
		});
		
		var botImage = leftImages[Math.floor(Math.random()*leftImages.length)];
		
		dsi.roomAction(room, function(data) {
			data.players.push({
				id: botName,
				x: 16,
				y: 16,
				score: 0,
				image: botImage
			});
		});
	});

	this.move = function() {

		if(this.sleep > Date.now()) {
			return;
		}
		this.sleep = Date.now() + Math.round(thinkSpeedRange.low + Math.random() * (thinkSpeedRange.high - thinkSpeedRange.low));

		dsi.roomAction(room, function(data) {

			if(!data.players || !data.coins) {
				return;
			}

			data.players.forEach(function(dplayer, i){
				if(dplayer.id === botName) {
			
					if(this.path == undefined) {
						this.path = pathfinder.findObject({
							x: dplayer.x,
							y: dplayer.y
						}, function(node) {
							return data.coins.reduce(function(acc, coin) {
								return acc || (coin.x === node.x && coin.y === node.y)
							}, false);
						});
					}

					if(this.path) {

						var node = this.path.shift();
						dplayer.x = node.x
						dplayer.y = node.y;

						data.coins = data.coins.filter((dcoin) => {
							if(dplayer.x === dcoin.x && dplayer.y === dcoin.y) {
								dplayer.score += 1;
								return false;
							}
							return true;
						});

						if(this.path.length == 0) {
							this.path = undefined;
						}
					}
				}
			}.bind(this));
		}.bind(this));
	}.bind(this);
};