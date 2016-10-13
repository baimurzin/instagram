var db = require('./models/db'),
	url = require('./services/url-shortener'),
	inbox = require('./services/inbox-reader'),
	key = 'AIzaSyCWmPvWVXnkoZOAmUbyObrqjnjnpd7_TsU',
	UrlTool = new url(db, {key: key});


App = function (account) {
	this.DM = new inbox(account);
};

App.prototype.start = function() {
	var dm = this.DM;
	dm.read();
	UrlTool.proccess();
};



module.exports = App;