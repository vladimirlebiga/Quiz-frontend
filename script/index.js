//variables
let timeToNext = 10000; // 30000
let interval = null;
let leftToNext = timeToNext;
let divTimer = document.createElement("div");
const root = document.getElementById("root");
root.append(divTimer);
const cheatConfig = {
  "50/50": {
    title: "50/50",
    className: "",
  },
  friend: { title: "friend", className: "" },
  public: { title: "public", className: "" },
};

/////////////////////////////////////////////////////////////////////////
const url = window.location.pathname.split("/").slice(-1);
const newUrl = url[0].split(".")[0];
console.log(url);
console.log(newUrl);
let game = null;

const getGameQuestion = async (newUrl) => {
  const res = await fetch(`http://localhost:3000/${newUrl}`);
  const data = await res.json();
  startGame(data);
};
const questions = getGameQuestion(newUrl);

function startGame(data) {
  game = new Game(data);
  game.shuffle();
  // game.interval = game.controlTimer();
  const div = document.createElement("div");
  div.id = "question";

  // console.log(question);
  cheatQuestion();
  root.append(div);
  renderQuestion(div);
  renderScore();
}

function cheatQuestion() {
  root.insertAdjacentHTML(
    "afterbegin",
    `<div id='cheats'><ul>${Object.values(cheatConfig)
      .map((item) => {
        return `<li><button class="${item.className}">${item.title}</button></li>`;
      })
      .join("")}</ul>
  </div>`
  );
  createCheeatListener();
}

function createCheeatListener() {
  const cheats = document.getElementById("cheats");
  cheats.addEventListener("click", handleCheat);
}

function handleCheat(e) {
  const target = e.target;
  const questions = document.querySelectorAll("#question li");

  target.disabled = true;

  if (target.textContent === "50/50") {
    const correctAnswer = game.helpFromButton();
    console.log(correctAnswer);

    questions.forEach((item) => {
      if (!correctAnswer.includes(item.textContent)) {
        const firstWord = item.textContent.split(" ")[0];
        item.textContent = firstWord; // homework keep only the first letter
      }
    });
  }
  if (target.textContent === "friend") {
    const helpFromFriend = game.helpFromFriend();
    console.log(helpFromFriend);
  }
  if (target.textContent === "public") {
    const helpFromPublic = game.helpFromPublic();
    // console.log(helpFromPublic);
  }
}

function renderQuestion(div) {
  const question = game.choseQuestion();
  const questionArray = Object.values(question.answers);
  div.innerHTML = "";

  stopInterval();
  controlTimer();

  div.insertAdjacentHTML(
    "beforeend",
    `<h4>${question.question}</h4><ul class=answers>${questionArray
      .map((item) => {
        return `<li id=${item.split(" ").join("_")}>${item}</li>`;
      })
      .join("")}
  </ul>`
  );

  createListener();
}

function createListener() {
  const questionAnswers = document.querySelector(".answers");
  questionAnswers.addEventListener("click", handleClick);
}

function handleClick(event) {
  const answer = event.target.id.split("_").join(" ");
  const isCorrect = game.isCorrect(answer);
  const numberQuestion = game.numberOfQuestion;
  stopInterval();
  leftToNext = timeToNext;
  if (!isCorrect) {
    if (numberQuestion < 5) {
      localStorage.setItem("Score", 0);
    }
    if (numberQuestion >= 5 && numberQuestion < 10) {
      localStorage.setItem("Score", 1000);
    }
    if (numberQuestion >= 10) {
      localStorage.setItem("Score", 32000);
    }
    setTimeout(() => {
      window.location.href = "./gameover.html";
    }, 3000);
    return;
  }
  if (isCorrect) {
    if (game.isWin()) {
      localStorage.setItem("Score", 1000000);
      setTimeout(() => {
        window.location.href = "./uwin.html";
      }, 3000);
      return;
    }
    const div = document.getElementById("question");
    renderQuestion(div);
  }
}

function renderScore() {
  let index = 15;
  root.insertAdjacentHTML(
    "beforeend",
    `<ul id='score'>${[...game.scores]
      .reverse()
      .map((item) => {
        return `<li class='point'>${index--} ${item}</li>`;
      })
      .join(" ")}</ul>`
  );
}

function controlTimer() {
  interval = setInterval(() => {
    leftToNext -= 10;
    if (leftToNext <= 0) {
      clearInterval(interval);
      window.location.href = "./gameover.html";
    }
    divTimer.textContent = (leftToNext / 1000).toFixed(3);
  }, 10);
}

function stopInterval() {
  clearInterval(interval);
}
