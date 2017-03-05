var config = require('../src/config.json');

var map = require('../src/maps/island_large.json');

module.exports = function(dsi, botFactory) {

    // Initialize game
    dsi.on("room-create", function(room) {
        dsi.roomAction(room, function(data) {
            var coins = map.layers[1].objects.map(function(coin, id){
                return {
                    id: id,
                    x: Math.floor(coin.x / map.tilewidth),
                    y: Math.floor(coin.y / map.tileheight)
                };
            });

            data.players = [];
            data.coins = coins;
            data.stage = "lobby";
        });
    });

    // Start of game
    dsi.on('edit', dsi.editFilter(/(.*?)\.players\.(\d*?)\.image/, function(conn, edits) {
        var room = edits.room;

        dsi.getData(room, function(data) {
            var ready = data.players.reduce(function(acc, player) {
                return acc && player.image !== undefined;
            }, true);

            if(ready) {

                var countdown = function(timeLeft) {
                    if(timeLeft > 0) {
                        dsi.roomAction(room, function(data) {
                            if(data.players) {
                                data.countdown = timeLeft;
                            }
                        });
                        setTimeout(countdown.bind(this, timeLeft-1), 1000);
                    } else {
                        dsi.roomAction(room, function(data) {
                            data.stage = "play";
                            data.startTime = Date.now();
                        });

                        var botsCount = config.maxPlayers - data.players.length;
                        for(var i=0; i<botsCount; i++) {
                            botFactory.spawn(room, "bot_"+i);
                        }
                    }
                }

                countdown(5);
            }
        });
    }));

    // End of game
    dsi.on('edit', dsi.editFilter(/(.*?)\.coins\.(\d*?)/, function(conn, edits) {
        var room = edits.room;

        dsi.getData(room, function(roomData) {
            if(roomData.coins.length == 0) {
                dsi.roomAction(room, function(data) {
                    data.stage = "end";
                    data.endTime = Date.now();
                });
            }
        });
    }));

    // Room info
    dsi.on('edit', dsi.editFilter(/(.*?)\.stage/, function(conn, edits) {
        var room = edits.room;

        dsi.getData(room, function(roomData) {
            dsi.getData("__rooms__", function(roomsData) {
                roomsData.forEach(function(droom, index){
                    if(droom.id == room && droom.stage !== roomData.stage) {
                        dsi.roomAction("__rooms__", function(data) {
                            data[index].stage = roomData.stage;
                        });
                    }
                });
            });
        });
    }));

    dsi.on("room-close", function(room) {
        botFactory.despawn(room);
    });

}