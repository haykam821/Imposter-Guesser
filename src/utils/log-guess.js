const resultColors = require("./result-colors.js");

function logGuess(type, message, id, guessLogs = [], streak) {
	if (!guessLogs.includes(type.toLowerCase())) return;

	const color = resultColors[type.toLowerCase()] || resultColors.unknown;

	const parts = [];
	parts.push(color.bold(type.toUpperCase()));
	parts.push(message);
	parts.push("[" + id + "]");
	if (streak) {
		parts.push(`(streak: ${streak.current}, best: ${streak.best})`);
	}

	process.stdout.write(color(parts.join(" ") + "\n"));
}
module.exports = logGuess;