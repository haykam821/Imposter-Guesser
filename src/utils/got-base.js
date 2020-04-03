const got = require("got");
const { version } = require("../../package.json");

module.exports = got.extend({
	headers: {
		"user-agent": "Imposter Guesser v" + version,
	},
});