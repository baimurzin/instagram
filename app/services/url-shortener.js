var google = require('googleapis');
var urlshortener = google.urlshortener('v1');

function UrlShortener(db, conf) {
    this.db = db;
    this.key = conf.key;
}

UrlShortener.prototype.make = function (long) {
    var params = {
        resource: {
            longUrl: long
        },
        auth: this.key
    };

    console.log(this.key);
    urlshortener.url.insert(params, function (err, response) {
        if (err) {
            console.error( err.errors[0].message);
        } else {
            console.log(response.id);
        }
    });
};

module.exports = UrlShortener;