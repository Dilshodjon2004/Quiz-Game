// https://opentdb.com/api.php?amount=1

const _question = document.querySelector("#question"),
  _options = document.querySelector(".quiz-options"),
  _correctScore = document.querySelector("#correct-score"),
  _totalQuestion = document.querySelector(".total-question"),
  _checkBtn = document.querySelector("#check-answer"),
  _playAgainBtn = document.querySelector("#play-again"),
  _result = document.querySelector("#result");

let correctAnswer = "",
  correctScore = (askedCount = 0),
  totalQuestion = 10;

function eventListeners() {
  _checkBtn.addEventListener("click", checkingAnswer);
  _playAgainBtn.addEventListener("click", restartQuiz);
}

document.addEventListener("DOMContentLoaded", () => {
  loadQuestion();
  eventListeners();
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
});

async function loadQuestion() {
  const API_URL =
    "https://opentdb.com/api.php?amount=10&category=18&difficulty=medium";
  const result = await fetch(`${API_URL}`);
  const data = await result.json();
  // console.log(data.results[0]);
  _result.innerHTML = "";
  showQuestion(data.results[0]);
}

function showQuestion(data) {
  _checkBtn.disabled = false;
  correctAnswer = data.correct_answer;
  let incorrectAnswer = data.incorrect_answers;
  let optionList = incorrectAnswer;
  optionList.splice(
    Math.floor(Math.random() * (incorrectAnswer.length * 1)),
    0,
    correctAnswer
  );

  _question.innerHTML = `${data.question} <br> <span class="category">${data.category}</span>`;

  _options.innerHTML = `
    ${optionList
      .map(
        (option, index) => `
      <li>${index + 1}. <span>${option}</span></li>
    `
      )
      .join("")}
  `;

  selectOption();
}

// options selection
function selectOption() {
  _options.querySelectorAll("li").forEach((option) => {
    option.addEventListener("click", () => {
      if (_options.querySelector(".selected")) {
        const activeOption = _options.querySelector(".selected");
        activeOption.classList.remove("selected");
      }
      option.classList.add("selected");
    });
  });
}

// answer checking
function checkingAnswer() {
  _checkBtn.disabled = true;
  if (_options.querySelector(".selected")) {
    let selectedAnswer = _options.querySelector(".selected span").textContent;
    if (selectedAnswer.trim() == HTMLDecode(correctAnswer)) {
      correctScore++;
      _result.innerHTML = `<p><i class="fas fa-check"></i>Correct Answer!</p>`;
    } else {
      _result.innerHTML = `<p><i class="fas fa-times"></i>Incorrect Answer! </p> <small><p>${correctAnswer}</p></small>`;
    }
    checkCount();
  } else {
    _result.innerHTML = `<p><i class="fas fa-question"></i>Please select an option!</p>`;
    _checkBtn.disabled = false;
  }
}

// to convert html entitles into normal text of correct answer if there is any
function HTMLDecode(textString) {
  let doc = new DOMParser().parseFromString(textString, "text/html");
  return doc.documentElement.textContent;
}

function checkCount() {
  askedCount++;
  setCount();
  if (askedCount == totalQuestion) {
    _result.innerHTML = `<p>Your score is ${correctScore}.</p>`;
    _playAgainBtn.style.display = "block";
    _checkBtn.style.display = "none";
  } else {
    setTimeout(() => {
      loadQuestion();
    }, 300);
  }
}

function setCount() {
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
}

function restartQuiz() {
  correctScore = askedCount = 0;
  _playAgainBtn.style.display = "none";
  _checkBtn.style.display = "block";
  _checkBtn.disabled = false;
  setCount();
  loadQuestion();
}
