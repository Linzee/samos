var bot = require('./bot');

module.exports = function(dsi, clientAddress) {
    
    this.create = function(room, botName) {
        new bot(dsi, room, botName);
    }
}