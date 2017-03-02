var config = require('../src/config.json');

module.exports = function(dsi, botFactory) {

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
                        dsi.singleActionClient(room, function(data) {
                            if(data.players) {
                                data.countdown = timeLeft;
                            }
                        });
                        setTimeout(countdown.bind(this, timeLeft-1), 1000);
                    } else {
                        dsi.singleActionClient(room, function(data) {
                            data.stage = "play";
                            data.startTime = Date.now();
                        });

                        var botsCount = config.maxPlayers - data.players.length;
                        for(var i=0; i<botsCount; i++) {
                            botFactory.create(room, "bot_"+i);
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
                dsi.singleActionClient(room, function(data) {
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
                        dsi.singleActionClient("__rooms__", function(data) {
                            data[index].stage = roomData.stage;
                        });
                    }
                });
            });
        });
    }));

}