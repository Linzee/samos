export default class MatMatData {

	constructor() {
		this.qid = 0;
		this.questions = [{"question":"7 - 6","answer":"1"},{"question":"0 + 9","answer":"9"},{"question":"9 - 6","answer":"3"},{"question":"7 - 6","answer":"1"},{"question":"8 + 6","answer":"14"},{"question":"7 + 6","answer":"13"},{"question":"8 - 5","answer":"3"},{"question":"3 + 1","answer":"4"},{"question":"9 - 8","answer":"1"},{"question":"10 - 7","answer":"3"},{"question":"10 + 7","answer":"17"},{"question":"5 - 3","answer":"2"},{"question":"7 + 5","answer":"12"},{"question":"0 + 2","answer":"2"},{"question":"4 + 6","answer":"10"},{"question":"8 + 0","answer":"8"},{"question":"9 + 2","answer":"11"},{"question":"9 - 3","answer":"6"},{"question":"7 - 6","answer":"1"},{"question":"6 - 3","answer":"3"},{"question":"10 - 7","answer":"3"},{"question":"4 - 2","answer":"2"},{"question":"8 + 0","answer":"8"},{"question":"7 + 7","answer":"14"},{"question":"0 + 8","answer":"8"},{"question":"6 - 2","answer":"4"},{"question":"2 + 10","answer":"12"},{"question":"4 + 0","answer":"4"},{"question":"10 - 9","answer":"1"},{"question":"9 + 1","answer":"10"},{"question":"7 + 8","answer":"15"},{"question":"2 + 7","answer":"9"},{"question":"1 - 0","answer":"1"},{"question":"10 + 7","answer":"17"},{"question":"5 + 8","answer":"13"},{"question":"1 + 0","answer":"1"},{"question":"10 + 9","answer":"19"},{"question":"7 + 0","answer":"7"},{"question":"0 + 1","answer":"1"},{"question":"0 + 4","answer":"4"},{"question":"6 + 2","answer":"8"},{"question":"1 + 4","answer":"5"},{"question":"10 + 10","answer":"20"},{"question":"9 + 1","answer":"10"},{"question":"4 - 1","answer":"3"},{"question":"8 + 3","answer":"11"},{"question":"6 + 6","answer":"12"},{"question":"4 + 10","answer":"14"},{"question":"8 + 9","answer":"17"},{"question":"6 + 3","answer":"9"},{"question":"5 + 1","answer":"6"},{"question":"4 + 5","answer":"9"},{"question":"8 - 1","answer":"7"},{"question":"7 - 5","answer":"2"},{"question":"9 + 10","answer":"19"},{"question":"6 + 0","answer":"6"},{"question":"8 + 0","answer":"8"},{"question":"5 - 2","answer":"3"},{"question":"9 - 9","answer":"0"},{"question":"7 + 3","answer":"10"},{"question":"9 + 2","answer":"11"},{"question":"1 + 6","answer":"7"},{"question":"7 + 9","answer":"16"},{"question":"9 - 8","answer":"1"},{"question":"1 - 1","answer":"0"},{"question":"2 + 9","answer":"11"},{"question":"9 + 4","answer":"13"},{"question":"8 + 0","answer":"8"},{"question":"7 - 0","answer":"7"},{"question":"3 +5","answer":"8"},{"question":"10 - 9","answer":"1"},{"question":"1 + 2","answer":"3"},{"question":"8 - 6","answer":"2"},{"question":"4 - 4","answer":"0"},{"question":"8 - 0","answer":"8"},{"question":"8 - 5","answer":"3"},{"question":"1 + 10","answer":"11"},{"question":"1 + 2","answer":"3"},{"question":"9 + 4","answer":"13"},{"question":"1 + 2","answer":"3"},{"question":"6 + 0","answer":"6"},{"question":"7 + 3","answer":"10"},{"question":"9 + 7","answer":"16"},{"question":"7+ 1","answer":"8"},{"question":"10 - 4","answer":"6"},{"question":"7 + 5","answer":"12"},{"question":"6 + 0","answer":"6"},{"question":"1 + 0","answer":"1"},{"question":"6 - 1","answer":"5"},{"question":"1 + 8","answer":"9"},{"question":"0+ 5","answer":"5"},{"question":"5 + 8","answer":"13"},{"question":"8 - 8","answer":"0"},{"question":"9 + 2","answer":"11"},{"question":"4 - 0","answer":"4"},{"question":"6 + 5","answer":"11"},{"question":"4 + 10","answer":"14"},{"question":"8 + 10","answer":"18"},{"question":"2 + 4","answer":"6"},{"question":"5 + 9","answer":"14"}];
	}

	getQuestion(currentAnswers = []) {

		var shuffle = (a) => {
			for (let i = a.length; i; i--) {
				let j = Math.floor(Math.random() * i);
				[a[i - 1], a[j]] = [a[j], a[i - 1]];
			}
		}

		let q = null;
		do {
			if(this.qid >= this.questions.length) {
				this.qid = 0;
			}

			if(this.qid === 0) {
				shuffle(this.questions);
			}

			q = this.questions[this.qid++];
		} while (currentAnswers.includes(q.answer));
		return q;
	}
};
