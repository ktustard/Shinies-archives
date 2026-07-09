const eraImage = document.getElementById("eraImage");
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const progressEl = document.getElementById("progress");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");

let questions = [];
let currentIndex = 0;
let score = 0;
let answered = false;

async function loadGame(){
    const response = await fetch("../data/guess-era.json");
    questions = await response.json();
    showQuestion();
}

function showQuestion(){
    answered = false;

    const current = questions[currentIndex];

    progressEl.textContent = `Question ${currentIndex + 1} / ${questions.length}`;
    scoreEl.textContent = `Score: ${score}`;
    eraImage.src = current.image;
    questionEl.textContent = current.question;

    choicesEl.innerHTML = "";
    nextBtn.style.display = "none";

    current.choices.forEach(choice => {
        const button = document.createElement("button");
        button.className = "choice-btn";
        button.textContent = choice;

        button.addEventListener("click", () => selectChoice(button, choice));

        choicesEl.appendChild(button);
    });
}

function selectChoice(button, choice){
    if(answered) return;

    answered = true;

    const correctAnswer = questions[currentIndex].answer;
    const allButtons = document.querySelectorAll(".choice-btn");

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

    eraImage.style.display = "none";

    questionEl.innerHTML = `
        <div>Era Game Complete ✨</div>
        <p style="font-size:1rem;color:rgba(255,255,255,.75);margin-top:12px;">
            You scored ${score} out of ${questions.length}.
        </p>
    `;

    choicesEl.innerHTML = "";

    nextBtn.textContent = "Play Again";
    nextBtn.style.display = "inline-block";

    nextBtn.onclick = () => {
        currentIndex = 0;
        score = 0;
        eraImage.style.display = "block";
        nextBtn.textContent = "Next Era →";
        nextBtn.onclick = null;
        showQuestion();
    };
}

loadGame();