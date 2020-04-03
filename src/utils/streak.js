class Streak {
	constructor(current = 0, best = 0) {
		this.current = current;
		this.best = best || current;
	}

	changeStreak(value) {
		this.current = value;
		return value > this.best;
	}

	incrementStreak() {
		return this.changeStreak(this.current + 1);
	}

	resetStreak() {
		this.best = Math.max(this.current, this.best);
		this.current = 0;
	}
}
module.exports.Streak = Streak;

async function getStreak(requester) {
	const response = await requester("status", {
		responseType: "json",
	});
	return new Streak(response.body.win_streak, response.body.max_win_streak);
}
module.exports.getStreak = getStreak;