var io = require('socket.io-client');
var diffSync = require('../lib/diffsync');

var CLOSE_DELAY = 3 * 1000;

module.exports = function(dsi) {

    this.roomCounters = {};
    this.roomTimeouts = {};

    dsi.on("connect", function(conn, room) {
        if(this.roomTimeouts[room]) {
            clearTimeout(this.roomTimeouts[room]);
            delete this.roomTimeouts[room];
        }
        if(this.roomCounters[room]) {
            this.roomCounters[room]++;
        } else {
            this.roomCounters[room] = 1;

            dsi.emit("room-create", room);
        }
    }.bind(this));

    var closeRoom = (function(room) {
        dsi.roomAction("__rooms__", function(data) {
            data.forEach(function(droom, i){
                if(droom.id == room) {
                    data.splice(i, 1);
                }
            });
        });

        delete this.roomCounters[room];
        dsi.diffSyncServer.closeRoom(room);

        dsi.emit("room-close", room);
    }).bind(this);

    dsi.on("disconnect", function(conn, room) {

        if(this.roomCounters[room]) {
            this.roomCounters[room]--;

            if(this.roomCounters[room] == 0) {
                this.roomTimeouts[room] = setTimeout(function() {closeRoom(room)}, CLOSE_DELAY);
            }

        } else {
            throw new Error("what? more disconnects than connects!");
        }

        //player leave
        dsi.roomAction(room, function(data) {
            if(data.players) {
                data.players = data.players.filter((dplayer) => {
                    return dplayer.id !== conn.id;
                });
            }
        });

    }.bind(this));
}