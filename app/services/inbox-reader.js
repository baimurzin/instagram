var Client = require('instagram-private-api').V1;
var _ = require('underscore');
var Inbox = require('../models/db');
var winston = require('winston');

InboxReader = function (auth, db) {
    this.db = db;
    this.auth = auth;
    this.device = new Client.Device(auth.username);
    this.storage = new Client.CookieFileStorage(__dirname + '/../../cookies/' + auth.username + '.json');
};

InboxReader.prototype.sendReply = function () {
    //find ready for reply url in db
    Client.Session.create(this.device, this.storage, this.auth.username, this.auth.password)
        .then(function (session) {
            Inbox.find({
                status: 'WAIT',
                url: {"$exists": true},
                short_url: {"$exists": true}
            }, function (err, items) {
                if (err) {
                    winston.warn('inbox-reader 23:');
                    winston.error(err);
                } else {
                    _.each(items || [], function (item) {
                        var threadId = item.thread_id;
                        Client.Thread.getById(session, threadId).then(function (thread) {
                            winston.info('thread found');
                            return thread.broadcastText(item.short_url);
                        }).then(function (res) {
                            item.status = 'COMPLETE';
                            item.save(function (err) {
                                if (err) {
                                    winston.info('inboxr-reader 36');
                                    winston.error(err);
                                } else {
                                    winston.info('message sent and thread saved');
                                }
                            })
                        }).catch(function (er) {
                            console.log(er);
                        });
                    });
                }

            });
        });
};

InboxReader.prototype.read = function () {
    //read DM and write to db
    Client.Session.create(this.device, this.storage, this.auth.username, this.auth.password)
        .then(function (session) {

            var feed = new Client.Feed.Inbox(session);
            return [session, feed.all()];
        })
        .spread(function (session, threads) {
            threads.forEach(function (Thread, index, threads) {

                var threadParams = parseThread(Thread);

                if (!threadParams.url) {
                    winston.info('can not save - no URL');
                    return;
                }

                var date = new Date();

                var exist = false;

                Inbox.find({thread_id: threadParams.threadId, status: 'WAIT'}, function (err, items) {
                    if (err) {
                        winston.info('inbox 64');
                        winston.error(err);
                    } else {
                        if (_.isEmpty(items)) {
                            createInboxRecord(threadParams);
                        } else {
                            _.each(items || [], function (item) {
                                date.setTime(item.last_activity);
                                var oldTime = date.getTime();

                                if (oldTime === threadParams.last_activity)
                                    exist = true;

                                if (!exist) {
                                    createInboxRecord(threadParams);
                                }
                            });
                        }

                    }
                });
                //todo check for last_activity to avoid duplicates
                //todo if last message from me do not save
                //todo if last message does not contain media do not save
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

function createInboxRecord(threadParams) {
    var inbox = new Inbox({
        thread_id: threadParams.threadId,
        url: threadParams.url,
        status: 'WAIT',
        last_activity: threadParams.last_activity
    });
    inbox.save(function (err, saved) {
        if (err)
            winston.error(err);
        else {
            winston.info("saved new thread: " + saved.thread_id);
        }
    })
}

function getMediaUrl(media) {
    if (media.images) {
        var images = media.images;
        var largeImage = images[0];
        var url = largeImage.url;
        return url;
    }
}

function isObj(o) {
    return !_.isNull(o) && !_.isUndefined(o);
}

module.exports = InboxReader;