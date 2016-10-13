var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var inboxSchema = new Schema({
	user: {
		type: String,
		required: true
	},
	url: {
		type: String
	},

	short_url: String,

	created_at: {
		type: Date,
		default: Date.now
	},
	updated_at: {
		type: Date,
		default: Date.now
	}
});

var Inbox = mongoose.model('Inbox', inboxSchema);

module.exports = Inbox;