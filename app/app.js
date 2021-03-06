var db = require('./models/db'),
    url = require('./services/url-shortener'),
    inbox = require('./services/inbox-reader'),
    key = 'AIzaSyCWmPvWVXnkoZOAmUbyObrqjnjnpd7_TsU',
    UrlTool = new url({key: key});


App = function (account) {
    this.DM = new inbox(account, db);
};
//each time when running make one loop for the new
App.prototype.start = function () {
    var dm = this.DM;
    dm.read();
    UrlTool.proccess();
    dm.sendReply();
};


module.exports = App;