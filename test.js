//var username = 'sweet_home_prod',
//    password = 'Notepad123';
//
var Client = require('instagram-private-api').V1,
    device = new Client.Device(username),
    storage = new Client.CookieFileStorage(__dirname + '/cookies/' + username + '.json');
//
//Client.Session.create(device, storage, username, password)
//    .then(function (session) {
//        var feed = new Client.Feed.Inbox(session);
//        return feed.all();
//    })
//    .then(function (feed) {
//
//    });

var url = require('./app/services/url-shortener');
var Url = new url(1, {key:'AIzaSyCWmPvWVXnkoZOAmUbyObrqjnjnpd7_TsU'});

Url.make('http://google.com');