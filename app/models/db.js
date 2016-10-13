var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

	mongoose.connect('mongodb://localhost/inst');

var models = {};

var inboxSchema = new Schema({
	thread_id: {
		type: String,
		required: true
	},
	url: {
		type: String
	},

	short_url: String,

	status: {
		type: String,
		default: 'WAIT'
	},

	last_activity: Date,

	created_at: {
		type: Date,
		default: Date.now
	},
	updated_at: {
		type: Date,
		default: Date.now
	}
});

inboxSchema.pre('save', function(next) {
	var currentDate = Date();

	this.updated_at = currentDate;

	if (!this.created_at)
		this.created_at = currentDate;

	next();
});


var Inbox = mongoose.model('Inbox', inboxSchema);

module.exports = Inbox