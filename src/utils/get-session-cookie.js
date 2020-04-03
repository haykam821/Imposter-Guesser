const got = require("./got-base.js");
const { CookieJar } = require("tough-cookie");

async function login(username, password) {
	const response = await got.post({
		form: {
			api_type: "json",
			passwd: password,
			user: username,
		},
		responseType: "json",
		url: "https://ssl.reddit.com/api/login",
	});
	return response.body.json.data.cookie;
}

async function getSessionCookie(sessionCookie, username, password, log) {
	let cookieValue = sessionCookie;
	if (sessionCookie) {
		log("using provided session");
	} else if (username && password) {
		log("fetching session token from username and password");
		cookieValue = await login(username, password);
	}

	const cookieJar = new CookieJar();
	cookieJar.setCookieSync("reddit_session=" + encodeURIComponent(cookieValue), "https://gremlins-api.reddit.com");

	log("successfully got session cookie");
	return cookieJar;
}
module.exports = getSessionCookie;