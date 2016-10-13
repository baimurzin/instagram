var Client = require('instagram-private-api').V1;
var _ = require('underscore');

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
		.spread(function(session, threads) {
			threads.forEach(function(Thread, index, threads) {
				console.log(parseThread(Thread));
			});
		})
};

function parseThread(thread) {
	var threadParams = thread.getParams();
	var result = {};

	result.threadId = threadParams.id;
	result.last_activity = threadParams.lastActivityAt;

	_.each(threadParams.items || [], function (item) {
		if (item.type === 'mediaShare') {
			var media = item.mediaShare;
			//todo check mediaType == 2?
			result.url = getMediaUrl(media);
		}
	});

	return result;
}

function getMediaUrl(media) {
	if (media.images) {
		var images = media.images;
		var largeImage = images[0];
		var url = largeImage.url;
		return url;
	}
}

module.exports = InboxReader;