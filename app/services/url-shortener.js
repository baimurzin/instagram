var google = require('googleapis');
var urlshortener = google.urlshortener('v1');
var Inbox = require('../models/db');

function UrlShortener(conf) {
    this.key = conf.key;
}

UrlShortener.prototype.proccess = function() {
    var self = this;
    Inbox.find({status: 'WAIT',url: {"$exists": true},short_url: {"$exists": false}}, function(err, items) {
        items.forEach(function(item) {
            var params = {
                resource: {
                    longUrl: item.url
                },
                auth: self.key
            };

            urlshortener.url.insert(params, function(err, response) {
                if (err) {
                    console.error(err.errors[0].message);
                } else {
                    var short_url = response.id;
                    item.short_url = short_url;
                    item.save(function (err) {
                        if (err)
                            console.log(err);
                        else 
                            console.log("item updated");
                    })
                }
            });
        });
    });

};

module.exports = UrlShortener;