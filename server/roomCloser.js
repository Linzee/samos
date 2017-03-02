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
        }
    }.bind(this));

    var closeRoom = (function(room) {
        dsi.singleActionClient("__rooms__", function(data) {
            data.splice( data.indexOf(room), 1);
        });

        delete this.roomCounters[room];
        dsi.diffSyncServer.closeRoom(room);
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
        dsi.singleActionClient(room, function(data) {
            if(data.players) {
                data.players = data.players.filter((dplayer) => {
                    return dplayer.id !== conn.id;
                });
            }
        });

    }.bind(this));
}