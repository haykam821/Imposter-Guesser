const chalk = require("chalk");

const resultColors = {
	easy: chalk.hex("#99E6A7"),
	error: chalk.hex("#750014"),
	invalid: chalk.hex("#B3001E"),
	lose: chalk.hex("#EA0027"),
	report: chalk.hex("#DDBD37"),
	skip: chalk.gray,
	unknown: chalk.hex("#000000"),
	win: chalk.hex("#46D160"),
};
module.exports = resultColors;