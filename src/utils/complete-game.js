const randomItem = require("random-item");

const { log } = require("./debug.js");

const getNoteChoices = require("./get-note-choices.js");
const guess = require("./guess.js");
const logGuess = require("./log-guess.js");
const submit = require("./submit.js");

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

	// Submit guess
	guess(chosenNote.id, noteChoices.csrf, redditGot).then(result => {
		if (result.result === "WIN") {
			streak.incrementStreak();
		} else {
			streak.resetStreak();
		}

		const easyOrStatus = noteChoices.notes.length === 1 ? "easy" : result.result;
		logGuess(easyOrStatus, chosenNote.text.trim(), chosenNote.id, args.guessLogs, streak);

		submitGuessResults(result.result, noteChoices, chosenNote, sneknetGot).catch(error => {
			log("failed to submit guess results:", error);
		})
	}).catch(error => {
		log("error in guess submission:", error);
		logGuess("error", chosenNote.text.trim(), chosenNote.id, args.guessLogs);
	});
}
module.exports = completeGame;