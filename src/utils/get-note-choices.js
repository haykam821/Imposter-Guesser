const chalk = require("chalk");
const { parse } = require("node-html-parser");

const logGuess = require("./log-guess.js");

async function getIncorrectNotes(notes, sneknetGot) {
	const query = await sneknetGot.post("y20/query", {
		json: {
			options: notes,
		},
	});
	
	if (query.body && query.body.answers) {
		return query.body.answers.filter(note => {
			return !note.correct;
		}).map(note => {
			return note.message;
		});
	}
	return [];
}

async function getNoteChoices(redditGot, sneknetGot, guessLogs) {
	const roomResponse = await redditGot("room");
	const room = roomResponse.body;
	const roomDocument = parse(room);

	const noteElements = Array.from(roomDocument.querySelectorAll("gremlin-note"));
	const notes = noteElements.map(note => {
		return note.text.trim();
	});

	const incorrectNotes = await getIncorrectNotes(notes, sneknetGot);
	const possibleNotes = noteElements.filter(note => {
		const message = note.text.trim();

		if (!incorrectNotes.includes(message)) {
			return true;
		}
		
		logGuess("SKIP", message, note.id, guessLogs);
	});

	return {
		csrf: room.match(/(csrf="(.+)")/)[2],
		notes: possibleNotes,
	};
}
module.exports = getNoteChoices;