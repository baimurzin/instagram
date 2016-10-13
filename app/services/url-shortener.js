var google = require('googleapis');
var urlshortener = google.urlshortener('v1');
var Inbox = require('../models/db');
var  winston = require('winston');

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
                    winston.warn('url-shortener 23');
                    winston.error(err);
                } else {
                    var short_url = response.id;
                    item.short_url = short_url;
                    item.save(function (err) {
                        if (err){
                            winston.warn('url-shortener 30');
                            winston.error(err);
                        }
                        else 
                            console.log("item updated");
                    })
                }
            });
        });
    });

};

module.exports = UrlShortener;