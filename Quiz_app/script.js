const progressBar = document.querySelector(".progress-bar"),
  progressText = document.querySelector(".progress-text");

const progress = (value) => {
  const percentage = (value / time) * 100;
  progressBar.style.width = `${percentage}%`;
  progressText.innerHTML = `${value}`;
};

const startBtn = document.querySelector(".start"),
  numQuestions = document.querySelector("#num-questions"),
  category = document.querySelector("#category"),
  difficulty = document.querySelector("#difficulty"),
  timePerQuestion = document.querySelector("#time"),
  quiz = document.querySelector(".quiz"),
  startScreen = document.querySelector(".start-screen");

let questions = [],
  time = 30,
  score = 0,
  currentQuestion,
  timer;
let totalQuestions;
let halfTime;

const startQuiz = () => {
  const num = numQuestions.value,
    cat = category.value,
    diff = difficulty.value;
  time = parseInt(timePerQuestion.value);
  halfTime = Math.floor(time / 2);
  loadingAnimation();
  const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      questions = data.results;
      totalQuestions = questions.length;
      setTimeout(() => {
        startScreen.classList.add("hide");
        quiz.classList.remove("hide");
        currentQuestion = 1;
        showQuestion(questions[0]);
      }, 1000);
    });
};

startBtn.addEventListener("click", startQuiz);

const showQuestion = (question) => {
  const questionText = document.querySelector(".question"),
    answersWrapper = document.querySelector(".answer-wrapper"),
    questionNumber = document.querySelector(".number");

  questionText.innerHTML = question.question;

  const answers = [
    ...question.incorrect_answers,
    question.correct_answer.toString(),
  ];
  answersWrapper.innerHTML = "";
  answers.sort(() => Math.random() - 0.5);
  answers.forEach((answer) => {
    answersWrapper.innerHTML += `
      <div class="answer">
        <span class="text">${answer}</span>
        <span class="checkbox">
          <i class="fas fa-check"></i>
        </span>
      </div>`;
  });

  questionNumber.innerHTML = `Question <span class="current">${
    questions.indexOf(question) + 1
  }</span>
        <span class="total">/${questions.length}</span>`;

  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach((answer) => {
    answer.addEventListener("click", () => {
      if (!answer.classList.contains("checked")) {
        answersDiv.forEach((answer) => {
          answer.classList.remove("selected");
        });
        answer.classList.add("selected");
        submitBtn.disabled = false;
      }
    });
  });

  time = parseInt(timePerQuestion.value);
  startTimer(time);
};

const startTimer = (time) => {
  timer = setInterval(() => {
    if (time === halfTime) {
      playAudio("countdown.mp3");
    }
    if (time >= 0) {
      progress(time);
      time--;
    } else {
      // Automatically show the correct answer when time runs out
      checkAnswer(true);
    }
  }, 1000);
};

let loadingInterval;
const loadingAnimation = () => {
  startBtn.innerHTML = "Loading";
  loadingInterval = setInterval(() => {
    if (startBtn.innerHTML.length === 10) {
      startBtn.innerHTML = "Loading";
    } else {
      startBtn.innerHTML += ".";
    }
  }, 500);
};

function defineProperty() {
  var osccred = document.createElement("div");
  osccred.innerHTML = "A Project By -Our Team";
  osccred.style.position = "absolute";
  osccred.style.bottom = "0";
  osccred.style.right = "0";
  osccred.style.fontSize = "10px";
  osccred.style.color = "#ccc";
  osccred.style.fontFamily = "sans-serif";
  osccred.style.padding = "5px";
  osccred.style.background = "#fff";
  osccred.style.borderTopLeftRadius = "5px";
  osccred.style.borderBottomRightRadius = "5px";
  osccred.style.boxShadow = "0 0 5px #ccc";
  document.body.appendChild(osccred);
}

defineProperty();

const submitBtn = document.querySelector(".submit"),
  nextBtn = document.querySelector(".next");

submitBtn.addEventListener("click", () => {
  checkAnswer();
});

nextBtn.addEventListener("click", () => {
  nextQuestion();
  submitBtn.style.display = "block";
  nextBtn.style.display = "none";
});

const checkAnswer = (auto = false) => {
  clearInterval(timer);
  const selectedAnswer = document.querySelector(".answer.selected");
  const correctAnswer = questions[currentQuestion - 1].correct_answer;
  const answersDiv = document.querySelectorAll(".answer");

  if (!auto && selectedAnswer) {
    const answer = selectedAnswer.querySelector(".text").innerHTML;
    if (answer === correctAnswer) {
      score++;
      selectedAnswer.classList.add("correct");
    } else {
      selectedAnswer.classList.add("wrong");
      showCorrectAnswer(correctAnswer);
    }
  } else {
    // Automatically display the correct answer if no answer is selected or timer runs out
    showCorrectAnswer(correctAnswer);
  }

  answersDiv.forEach((answer) => {
    answer.classList.add("checked");
  });

  submitBtn.style.display = "none";
  nextBtn.style.display = "block";
};

const showCorrectAnswer = (correctAnswer) => {
  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach((answer) => {
    if (answer.querySelector(".text").innerHTML === correctAnswer) {
      answer.classList.add("correct");
    }
  });
};

const nextQuestion = () => {
  if (currentQuestion < questions.length) {
    currentQuestion++;
    showQuestion(questions[currentQuestion - 1]);
  } else {
    showScore();
  }
};

const endScreen = document.querySelector(".end-screen"),
  finalScore = document.querySelector(".final-score"),
  totalScore = document.querySelector(".total-score");

const showScore = () => {
  endScreen.classList.remove("hide");
  quiz.classList.add("hide");
  finalScore.innerHTML = score;
  totalScore.innerHTML = `/${questions.length || 0}`;

  const saveScoreBtn = document.createElement("button");
  saveScoreBtn.className = "save-score";
  saveScoreBtn.innerHTML = "Save your score";
  endScreen.appendChild(saveScoreBtn);

  saveScoreBtn.addEventListener("click", () => {
    const username = prompt("Enter your username:");
    if (username) {
      saveScore(username, score);
      alert("Score saved successfully!");
    }
  });
};

function saveScore(username, score) {
  const highscores = JSON.parse(localStorage.getItem("highscores")) || [];
  const newScore = {
    username: username,
    score: score,
    totalQuestions: totalQuestions,
  };

  highscores.push(newScore);
  localStorage.setItem("highscores", JSON.stringify(highscores));
}

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
  window.location.reload();
});

const Home = document.querySelector(".Home");
Home.addEventListener("click", () => {
  window.location.assign("index.html"); // Redirect to the home page file
});

const playAudio = (src) => {
  const audio = new Audio(src);
  audio.play();
};
