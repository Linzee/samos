var range = require('range').range;

module.exports = function(dsi, room, botName) {

	console.log("Bot "+botName+" joined "+room);

	this.botName = botName;

	//spawn
	dsi.getData(room, function(data) {
		var leftImages = range(20);
		
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
		dsi.roomAction(room, function(data) {

			if(!data.players || !data.coins) {
				return;
			}

			data.players.forEach(function(dplayer, i){
				if(dplayer.id === botName) {
			
					var angle = Math.round(Math.random() * 4);
					dplayer.x += Math.round(Math.cos(Math.PI/2*angle));
					dplayer.y += Math.round(Math.sin(Math.PI/2*angle));

					data.coins = data.coins.filter((dcoin) => {
						if(dplayer.x === dcoin.x && dplayer.y === dcoin.y) {
							dplayer.score += 1;
							return false;
						}
						return true;
					});
				}
			});
		});
	}
};