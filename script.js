const questions = [
    { q: "I ______ a love for me (Find)", options: ["Find", "Found", "Finded", "Finding"], correct: "Found" },
    { q: "We were just kids when we ______ in love.", options: ["fall", "fell", "fallen", "felled"], correct: "fell" },
    { q: "If I ______ (be) you, I would stay. (2nd Conditional)", options: ["am", "was", "were", "been"], correct: "were" },
    { q: "I have ______ (found) a girl, beautiful and sweet.", options: ["find", "found", "finded", "founden"], correct: "found" },
    { q: "If it ______ (rain) tonight, I will stay home. (1st Conditional)", options: ["rain", "rains", "rained", "raining"], correct: "rains" }
];

let currentIndex = 0;
let score = 0;
let userName = "";
let timer;
let timeLeft = 10;

// LOGIN ADMIN
function handleAdminLogin() {
    const pass = prompt("Enter Admin Password / Contraseña:");
    if (pass === "Ale333") {
        window.location.href = 'admin.htm';
    } else {
        alert("Incorrect Password! / ¡Contraseña Incorrecta!");
    }
}

function showInstructions() {
    userName = document.getElementById('username').value.trim();
    if (!userName) return alert("Please enter your name");
    document.getElementById('auth-screen').classList.remove('active');
    document.getElementById('instructions-screen').classList.add('active');
}

function startGame() {
    document.getElementById('instructions-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    loadQuestion();
}

function loadQuestion() {
    clearInterval(timer);
    timeLeft = 10;
    updateTimerUI();
    
    const q = questions[currentIndex];
    document.getElementById('question-text').innerText = q.q;
    const grid = document.getElementById('options-grid');
    grid.innerHTML = '';

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => handleAnswer(opt);
        grid.appendChild(btn);
    });
    startTimer();
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        updateTimerUI();
        if (timeLeft <= 0) handleAnswer(null);
    }, 1000);
}

function updateTimerUI() {
    document.getElementById('timer-text').innerText = timeLeft;
    const offset = 113 - (113 * timeLeft) / 10;
    document.getElementById('timer-circle').style.strokeDashoffset = offset;
}

function handleAnswer(choice) {
    clearInterval(timer);
    if (choice === questions[currentIndex].correct) {
        score += (timeLeft * 10) + 10; 
    }
    currentIndex++;
    document.getElementById('score-display').innerText = `${score} pts`;
    if (currentIndex < questions.length) {
        setTimeout(loadQuestion, 500);
    } else {
        finishGame();
    }
}

function finishGame() {
    let results = JSON.parse(localStorage.getItem('perfectGame')) || [];
    results.push({ name: userName, score: score });
    localStorage.setItem('perfectGame', JSON.stringify(results));
    alert(`GAME OVER / JUEGO TERMINADO\nName: ${userName}\nFinal Score: ${score}`);
    location.reload();
}