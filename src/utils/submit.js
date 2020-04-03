const { version } = require("../package.json");

async function submit(options, sneknetGot) {
	const submission = await sneknetGot.post("y20/submit", {
		json: {
			options,
			tag: "imposter-guesser-" + version
		},
	});
	return submission;
}
module.exports = submit;