var Client = require('instagram-private-api').V1;

InboxReader = function(auth) {
	this.auth = auth;
	this.device = new Client.Device(auth.username);
	this.storage = new Client.CookieFileStorage(__dirname + '/../../cookies/' + auth.username + '.json');
};

InboxReader.prototype.sendReply = function(reply) {
	//find ready for reply url in db 
};

InboxReader.prototype.read = function() {
	//read DM and write to db
	Client.Session.create(this.device, this.storage, this.auth.username, this.auth.password)
		.then(function(session) {
			var feed = new Client.Feed.Inbox(session);
			return [session, feed.all()];
		})
		.spread(function(session, feed) {
			
		})
};

module.exports = InboxReader;