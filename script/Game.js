class Game {
  constructor(questions) {
    this.questions = questions;
    this.correctAnswer = null;
    this.fiftyFifty = true;
    this.callFriend = true;
    this.helpPublic = true;
    this.numberOfQuestion = 0;
    this.current = null;
    this.score = 0;
    this.scores = [
      100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000,
      250000, 500000, 1000000,
    ];
    this.root = document.getElementById("root");
  }

  shuffle() {
    let questionsCategory = this.questions.length;
    let temp = null;
    let randomIndex = null;
    while (questionsCategory) {
      questionsCategory -= 1;
      randomIndex = this.randomizer(questionsCategory);
      temp = this.questions[questionsCategory];
      this.questions[questionsCategory] = this.questions[randomIndex];
      this.questions[randomIndex] = temp;
    }
    return this.questions;
  }

  choseQuestion() {
    this.numberOfQuestion++;
    const question = this.questions[0];
    this.correctAnswer = question.correctAnswer;
    this.questions = this.questions.slice(1);
    this.current = question;
    return question;
  }
  isCorrect(answer) {
    if (answer === this.correctAnswer) {
      this.score = this.scores[this.numberOfQuestion - 1];
      return true;
    }
    return false;
  }

  sumScore() {
    this.score += this.scores[this.numberOfQuestion];
    return this.score;
  }

  isWin() {
    return this.score === 1000000 && this.numberOfQuestion === 15;
  }

  isGameOver() {}

  randomizer(length) {
    return Math.floor(Math.random() * length);
  }

  helpFromButton() {
    if (!this.fiftyFifty) return;
    this.fiftyFifty = false;
    const answers = Object.values(this.current.answers);
    const correctAnswer = answers.filter(
      (item) => item === this.current.correctAnswer
    );
    const index = answers.findIndex(
      (item) => item === this.current.correctAnswer
    );
    answers.splice(index, 1);
    const randomIndex = this.randomizer(answers.length);
    correctAnswer.push(answers[randomIndex]);
    this.current.answers = correctAnswer.reduce((acc, current) => {
      const temp = current.split(" ")[0][0];
      // console.log(temp);
      acc[temp] = current;
      return acc;
    }, {});
    return correctAnswer;
  }

  helpFromFriend() {
    if (!this.callFriend) return;
    this.callFriend = false;
    console.log(this.current.answers);
    const answers = Object.values(this.current.answers);
    answers.length = answers.length + 2;
    const correctAnswers = answers.fill(
      this.current.correctAnswer,
      answers.length - 2,
      answers.length
    );
    console.log(correctAnswers);
    const randomAnswer = this.randomizer(correctAnswers.length);
    return correctAnswers[randomAnswer];
  }

  helpFromPublic() {
    if (!this.helpPublic) return;
    this.helpPublic = false;

    const answers = Object.values(this.current.answers); //this.currentQuestion.answers;
    const percentages = new Array(answers.length).fill(0);
    const correctIndex = answers.indexOf(this.correctAnswer);

    // Random boost between 50% to 80% for the correct answer
    const randomBoost = 50 + this.randomizer(30);
    percentages[correctIndex] = randomBoost;

    // Distribute the remaining percentage among other answers
    let remainingPercentage = 100 - randomBoost;

    // for (let i = 0; i < percentages.length; i++) {
    //   if (i !== correctIndex) {
    //     const randomPercentage = Math.floor(
    //       Math.random() * remainingPercentage
    //     );
    //     percentages[i] = randomPercentage;
    //     remainingPercentage -= randomPercentage;
    //   }
    // }

    percentages.forEach((item, index) => {
      if (index !== correctIndex) {
        const randomPercentage = Math.floor(
          Math.random() * remainingPercentage
        );
        percentages[index] = randomPercentage;
        remainingPercentage -= randomPercentage;
      }
    });

    // Distribute any leftover percentage (due to rounding) to one of the incorrect answers
    percentages[percentages.findIndex((val, idx) => idx !== correctIndex)] +=
      remainingPercentage;

    console.log(
      "Audience opinion: " +
        percentages.map((p, idx) => `${answers[idx]}: ${p}%`).join(", ")
    );
  }
}
