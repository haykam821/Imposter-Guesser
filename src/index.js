const got = require("./utils/got-base.js");

const delay = require("delay");

const { log } = require("./utils/debug.js");
const getSessionCookie = require("./utils/get-session-cookie.js");
const { getStreak } = require("./utils/streak.js");
const completeGame = require("./utils/complete-game.js");

async function start(args) {
	const redditGot = got.extend({
		prefixUrl: "https://gremlins-api.reddit.com",
		cookieJar: await getSessionCookie(args.sessionCookie, args.username, args.password, log),
	});

	const sneknetGot = got.extend({
		prefixUrl: "https://api.snakeroom.org",
		headers: {
			authorization: args.sneknet,
		},
		responseType: "json",
	});

	const streak = await getStreak(redditGot);
	log("initial streak is %d, with a best of %d", streak.current, streak.best);

	while (true) {
		try {
			await completeGame(redditGot, sneknetGot, streak, args);
			await delay(args.delay);
		} catch (error) {
			log("found uncaught error while completing game:", error);
		}
	}
}
module.exports = start;
