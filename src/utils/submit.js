async function submit(options, sneknetGot) {
	const submission = await sneknetGot.post("y20/submit", {
		json: {
			options,
			tag: "imposter-guesser-1.0.0"
		},
	});
	return submission;
}
module.exports = submit;