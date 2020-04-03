const got = require("got");

module.exports = got.extend({
	headers: {
		"user-agent": "Imposter Guesser v1.0.0",
	},
});