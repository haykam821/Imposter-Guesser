const delay = require("delay");
const { log } = require("./debug.js");

let lastReportAt = 0;

async function report(noteID, csrf, redditGot) {
	const timeUntilNextReport = Date.now() - lastReportAt;
	if (timeUntilNextReport < 60000) {
		log("waiting for report ratelimit to be over (%d seconds)", Math.ceil(timeUntilNextReport / 1000));
		await delay(timeUntilNextReport);
	}

	return redditGot.post("report_note", {
		form: {
			csrf_token: csrf,
			note_ids: noteID,
		},
	}).then(response => {
		lastReportAt = Date.now();
		return response;
	});
}
module.exports = report;