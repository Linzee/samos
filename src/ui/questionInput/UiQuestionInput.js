export default class UiQuestionInput {

	constructor() {
		var globalUi = document.querySelector("#ui");
		
		this.ui = document.createElement('div');
		this.ui.className = 'ui-questionInput';
		globalUi.appendChild(this.ui);
	}

	show(checkAnswerCallback) {
		this.ui.innerHTML = require("./template.html");
		
		var question = this.ui.querySelector("#formQuestion");
		var questionAnswer = question.querySelector("input[name=\"answer\"]");
		question.addEventListener("submit", (e) => {
			e.preventDefault();

			var correct = checkAnswerCallback(questionAnswer.value);
			questionAnswer.value = "";
			
			questionAnswer.className = correct ? "correct" : "incorrect";
			var newQuestionAnswer = questionAnswer.cloneNode(true);
			questionAnswer.parentNode.replaceChild(newQuestionAnswer, questionAnswer);
			questionAnswer = newQuestionAnswer;
			questionAnswer.focus();
		});

		questionAnswer.focus();
	}

	hide() {
		this.ui.innerHTML = "";
	}
};
