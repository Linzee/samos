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

    new roomCloser(diffSyncServer, 'ws://127.0.0.1:'+port, "__rooms__", 2 * 1000);
    
    // setInterval(function(){
    //     dataAdapter.getData('__rooms__', function(err, data){
    //         if(err) {
    //             console.log(err);
    //         } else {
    //             console.log(chalk.cyan("rooms:"));
    //             for(i in data) {
    //                 console.log(chalk.cyan(data[i].id+" ("+data[i].name+"):"));
    //                 dataAdapter.getData(data[i].id, function(err, rdata){
    //                     if(err) {
    //                         console.log(err);
    //                     } else {
    //                         console.log(chalk.cyan(JSON.stringify(rdata, null, 2)));
    //                     }
    //                 });
    //             }
    //         }
    //     });
    // }, 6000);

};