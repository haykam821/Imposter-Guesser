async function guess(id, csrf, redditGot) {
	const response = await redditGot.post("submit_guess", {
		form: {
			csrf_token: csrf,
			note_id: id,
		},
		responseType: "json",
	});
	return response.body;
}
module.exports = guess;