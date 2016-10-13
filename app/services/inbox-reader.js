var Client = require('instagram-private-api').V1;

InboxReader = function (auth) {
    this.device = new Client.Device(auth.username);
    this.storage = new Client.CookieFileStorage(__dirname + '/cookies/' + auth.username + '.json');
};

InboxReader.prototype.sendReply = function () {
    
}