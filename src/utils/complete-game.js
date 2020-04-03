const randomItem = require("random-item");

const { log } = require("./debug.js");

const getNoteChoices = require("./get-note-choices.js");
const guess = require("./guess.js");
const logGuess = require("./log-guess.js");
const submit = require("./submit.js");
const report = require("./report.js");

function submitGuessResults(result, noteChoices, chosenNote, sneknetGot) {
	if (result === "LOSE") {
		return submit([{
			correct: false,
			message: chosenNote.text.trim()
		}], sneknetGot);
	}

	return submit(noteChoices.notes.map(note => ({
		message: note.text.trim(),
		correct: chosenNote.id === note.id,
	})), sneknetGot)
}

async function completeGame(redditGot, sneknetGot, streak, args) {
	// Choose a note
	const noteChoices = await getNoteChoices(redditGot, sneknetGot, args.guessLogs);
	const chosenNote = randomItem(noteChoices.notes);

	if (noteChoices.notes.length === 0) {
		log("could not complete game as IDs were all marked as human:", noteChoices.notes);
		return;
	}

	if (args.report && noteChoices.notes.length > 1) {
		const reportedNote = noteChoices.notes[0];
		return report(reportedNote.id, noteChoices.csrf, redditGot).then(() => {
			logGuess("report", reportedNote.text.trim(), reportedNote.id, args.guessLogs);
		});
	}

	// Submit guess
	guess(chosenNote.id, noteChoices.csrf, redditGot).then(result => {
		const status = result.result ;
		const easyOrStatus = (noteChoices.notes.length === 1 && status === "WIN") ? "easy" : status;

		if (result.result === "LOSE") {
			streak.resetStreak();
		} else {
			streak.incrementStreak();
		}

		logGuess(easyOrStatus, chosenNote.text.trim(), chosenNote.id, args.guessLogs, streak);

		submitGuessResults(status, noteChoices, chosenNote, sneknetGot).catch(error => {
			log("failed to submit guess results:", error);
		})
	}).catch(error => {
		log("error in guess submission:", error);
		logGuess("error", chosenNote.text.trim(), chosenNote.id, args.guessLogs);
	});
}
module.exports = completeGame;