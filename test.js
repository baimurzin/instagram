//var username = 'sweet_home_prod',
//
// var Client = require('instagram-private-api').V1,
//     device = new Client.Device(username),
//     storage = new Client.CookieFileStorage(__dirname + '/cookies/' + username + '.json');
//
//Client.Session.create(device, storage, username, password)
//    .then(function (session) {
//        var feed = new Client.Feed.Inbox(session);
//        return feed.all();
//    })
//    .then(function (feed) {
//
//    });

var app = require('./app/app');

var App = new app({
	username: 'sweet_home_prod',
	password: 'Notepad123'
});

App.start();