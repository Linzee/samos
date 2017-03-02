var chalk = require('chalk');

module.exports = function(dsi) {

    dsi.on('edit', dsi.editFilter(/(.*?)\.players\.(\d*?)\.image/, function(conn, edits) {
        var room = edits.room;

        dsi.getData(room, function(data) {
            var ready = data.players.reduce(function(acc, player) {
                console.log([acc, player]);
                return acc && player.image !== undefined;
            }, true);

            if(ready) {
                console.log("Starting countdown!");

                var countdown = function(timeLeft) { 
                    console.log("countdown"+timeLeft);
                    if(timeLeft > 0) {
                        dsi.singleActionClient(room, function(data) {
                            if(data.players) {
                                data.countdown = timeLeft;
                            }
                        });
                        setTimeout(countdown.bind(this, timeLeft-1), timeLeft * 500);
                    } else {
                        dsi.singleActionClient(room, function(data) {
                            data.stage = "play";
                            data.startTime = Date.now();
                        });
                    }
                }

                countdown(5);
            }
        });
    }));

}