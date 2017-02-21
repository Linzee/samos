export default class UiQuestionInput {

	constructor(g) {

		this.ui = document.querySelector("#ui");
		g.scaleToWindow(this.ui);
	}

	show(checkAnswerCallback) {
		this.ui.innerHTML = require("./template.html");
		
		var question = this.ui.querySelector("#formQuestion");
		var questionAnswer = question.querySelector("input[name=\"answer\"]");
		question.addEventListener("submit", (e) => {
			e.preventDefault();

			var correct = checkAnswerCallback(questionAnswer.value);
			questionAnswer.className = correct ? "correct" : "incorrect";
			questionAnswer.value = "";
		});

		questionAnswer.focus();
	}

	hide() {
		this.ui.innerHTML = "";
	}
};
