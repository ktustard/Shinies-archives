const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const progressEl = document.getElementById("progress");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");

let questions = [];
let currentIndex = 0;
let score = 0;
let answered = false;

async function loadTrivia(){
    const response = await fetch("../data/trivia.json");
    questions = await response.json();
    showQuestion();
}

function showQuestion(){
    answered = false;

    const current = questions[currentIndex];

    progressEl.textContent = `Question ${currentIndex + 1} / ${questions.length}`;
    scoreEl.textContent = `Score: ${score}`;
    questionEl.textContent = current.question;

    answersEl.innerHTML = "";
    nextBtn.style.display = "none";

    current.choices.forEach(choice => {
        const button = document.createElement("button");
        button.className = "answer-btn";
        button.textContent = choice;

        button.addEventListener("click", () => selectAnswer(button, choice));

        answersEl.appendChild(button);
    });
}

function selectAnswer(button, choice){
    if(answered) return;

    answered = true;

    const correctAnswer = questions[currentIndex].answer;
    const allButtons = document.querySelectorAll(".answer-btn");

    allButtons.forEach(btn => {
        btn.disabled = true;

        if(btn.textContent === correctAnswer){
            btn.classList.add("correct");
        }
    });

    if(choice === correctAnswer){
        score++;
        button.classList.add("correct");
    }else{
        button.classList.add("wrong");
    }

    scoreEl.textContent = `Score: ${score}`;
    nextBtn.style.display = "inline-block";
}

nextBtn.addEventListener("click", () => {
    currentIndex++;

    if(currentIndex < questions.length){
        showQuestion();
    }else{
        showResult();
    }
});

function showResult(){
    progressEl.textContent = "Finished";
    scoreEl.textContent = `Final Score: ${score}/${questions.length}`;

    questionEl.innerHTML = `
        <div class="result-title">Trivia Complete ✨</div>
        <p class="result-text">
            You scored ${score} out of ${questions.length}.
        </p>
    `;

    answersEl.innerHTML = "";

    nextBtn.textContent = "Play Again";
    nextBtn.style.display = "inline-block";

    nextBtn.onclick = () => {
        currentIndex = 0;
        score = 0;
        nextBtn.textContent = "Next Question →";
        nextBtn.onclick = null;
        showQuestion();
    };
}

loadTrivia();