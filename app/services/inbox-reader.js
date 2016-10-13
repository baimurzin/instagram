var Client = require('instagram-private-api').V1;
var _ = require('underscore');
var Inbox = require('../models/db');
InboxReader = function(auth, db) {
	this.db = db;
	this.auth = auth;
	this.device = new Client.Device(auth.username);
	this.storage = new Client.CookieFileStorage(__dirname + '/../../cookies/' + auth.username + '.json');
};

InboxReader.prototype.sendReply = function(reply) {
	//find ready for reply url in db 
	Client.Session.create(this.device, this.storage, this.auth.username, this.auth.password)
		.then(function (session) {
			var thread = Client.Thread.getById(session, reply);
			return [session, thread];
		})
		.spread(function (session, thread) {
			return thread.broadcastText('http://google.com');
		})
		.then(function (res) {
			console.log(res);
		})
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
				var threadParams = parseThread(Thread);

				//todo check for last_activity to avoid duplicates 

				var inbox = new Inbox({
					thread_id: threadParams.threadId,
					url: threadParams.url,
					status: 'WAIT',
					last_activity: threadParams.last_activity
				});
				inbox.save(function(err) {
					console.log(err);
				})
			});
		})
};

function parseThread(thread) {
	var threadParams = thread.getParams();
	var result = {};

	result.threadId = threadParams.id;
	result.last_activity = threadParams.lastActivityAt;

	_.each(threadParams.items || [], function(item) {
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