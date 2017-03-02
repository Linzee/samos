var io = require('socket.io-client');
var diffSync = require('../lib/diffsync');
var EventEmitter = require('events').EventEmitter;

var DiffSyncIntegration = function(diffSyncServer, clientAddress) {

    EventEmitter.call(this);

    this.diffSyncServer = diffSyncServer;

    setTimeout((function(){
        this.connection = io(clientAddress);
    }).bind(this));

    this.singleActionClient = (function(room, dataModifyCallback) {
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
        if(room === "__rooms__") {
            return;
        }
        if(conn.id == this.connection.id) {
            return;
        }
        this.emit("connect", conn, room);
    }.bind(this));

    diffSyncServer.on("disconnect", function(conn, room) {
        if(room === "__rooms__") {
            return;
        }
        if(conn.id == this.connection.id) {
            return;
        }
        this.emit("disconnect", conn, room);
    }.bind(this));

    diffSyncServer.on("edit", function(conn, edits){
        this.emit("edit", conn, edits);
    }.bind(this));


    var editFilterGetObjectPaths = function(object) {
        var results = [];
        
        if(Array.isArray(object)) {
            return editFilterGetObjectPaths(object[0]);
        }

        if(typeof(object) === 'object') {
            Object.keys(object).forEach(function(key) {
                var children = editFilterGetObjectPaths(object[key]);
                if(children.length) {
                    children.forEach(function(child){
                        results.push(key + "." + child);
                    });
                } else {
                    results.push(key);
                }
            });
        }
        return results;
    }

    var editFilterAllPaths = function(edits) {
        var results = [];
        for(i in edits.edits) {
            editFilterGetObjectPaths(edits.edits[i].diff).forEach(function(path) {
                results.push(edits.room + "." + path);
            });
        }
        return results;
    }

    this.editFilter = function(pattern, callback) {
        return (function(pattern, callback){
            return function(conn, edits) {
                var paths = editFilterAllPaths(edits);
                for(i in paths) {
                    if(pattern.test(paths[i])) {
                        callback(conn, edits);
                        return;
                    }
                }
            }
        })(pattern, callback);
    }

    this.getData = function(room, callback) {
        this.diffSyncServer.getData(room, function(err, data) {
            if(err) {
                throw err;
            }
            callback(data.serverCopy);
        });
    }
}

// inherit from EventEmitter
DiffSyncIntegration.prototype = Object.create(EventEmitter.prototype);
DiffSyncIntegration.prototype.constructor = DiffSyncIntegration;

module.exports = DiffSyncIntegration;