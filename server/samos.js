var chalk = require('chalk');

module.exports = function(dsi) {

    dsi.on('edit', dsi.editFilter(/(.*?)\.players\.(\d*?)\.image/, function(conn, edits) {
        dsi.getData(edits.room, function(data) {
            var ready = data.players.reduce(function(acc, player) {
                console.log([acc, player]);
                return acc && player.image !== undefined;
            }, true);

            if(ready) {
                console.log("Starting countdown!");
            }
        });
    }));

}