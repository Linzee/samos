var roomCloser = require('./roomCloser');
var chalk = require('chalk');

module.exports = function (server, port) {
	var io = require('socket.io')(server);

    // setting up diffsync's DataAdapter 
    var diffSync = require('../lib/diffsync');
    var dataAdapter = new diffSync.InMemoryDataAdapter();

    // setting up the diffsync server 
    var diffSyncServer = new diffSync.Server(dataAdapter, io);

    //Setup initial structure
    dataAdapter.storeData("__rooms__", [], function(err){
        if(err) {
            console.log(err);
        }
    });

    return diffSyncServer;
};