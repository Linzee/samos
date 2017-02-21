var io = require('socket.io-client');
var diffSync = require('../lib/diffsync');

module.exports = function(diffSyncServer, clientAddress, roomsRoomName, closeDelay) {

    this.roomCounters = {};
    this.roomTimeouts = {};

    setTimeout((function(){
        this.connection = io(clientAddress);
    }).bind(this));

    var singleActionClient = (function(room, dataModifyCallback) {
        var client = new diffSync.Client(this.connection, room);
        client.on('connected', function() {
            var data = client.getData();
            dataModifyCallback(data);
            client.sync();
            client.on('synced', function() {
                client.close();
            });
        });
        client.initialize();
    }).bind(this);

    diffSyncServer.on("connect", function(conn, room) {
        if(room === roomsRoomName) {
            return;
        }
        if(conn.id == this.connection.id) {
            return;
        }

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
    singleActionClient(roomsRoomName, function(data) {
        data.splice( data.indexOf(room), 1);
    });

    delete this.roomCounters[room];
    diffSyncServer.closeRoom(room);
}).bind(this);

diffSyncServer.on("disconnect", function(conn, room) {
    if(room === roomsRoomName) {
        return;
    }
    if(conn.id == this.connection.id) {
        return;
    }

    if(this.roomCounters[room]) {
        this.roomCounters[room]--;

        if(this.roomCounters[room] == 0) {
            this.roomTimeouts[room] = setTimeout(function() {closeRoom(room)}, closeDelay);
        }

    } else {
        throw new Error("what? more disconnects than connects!");
    }

        //player leave
        singleActionClient(room, function(data) {
            if(data.players) {
                data.players = data.players.filter((dplayer) => {
                    return dplayer.id !== conn.id;
                });
            }
        });

    }.bind(this));
}