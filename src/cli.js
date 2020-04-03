const guesser = require(".");

const caporal = require("caporal");

const { version } = require("../package.json");
caporal.version(version);

const { debug } = require("./utils/debug.js");
const debugOption = ["--debug [debug]", "The debuggers to enable.", caporal.STRING, "imposter-guesser:*"];

const start = caporal.command("start", "Starts the guesser.");
start.option(...debugOption);
start.option("--guess-logs [guess-logs]", "The allowed logs for guessing.", caporal.ARRAY);
start.option("--sneknet [sneknet]", "The Sneknet token.", caporal.STRING, null, true);
start.option("--username [username]", "The Reddit username to authenticate with, used alongside the password.", caporal.STRING);
start.option("--password [password]", "The Reddit password to authenticate with, used alongside the username.", caporal.STRING);
start.option("--session-cookie [session-cookie]", "The session cookie to authenticate with.", caporal.STRING);
start.option("--delay [delay]", "The delay between games.", caporal.INTEGER);
start.action(args => {
	debug.enable(args);
	guesser(args);
});

caporal.parse(process.argv);