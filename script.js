const questions = [
    { 
        q: "She ______ (share) my dreams in the song.", 
        options: ["share", "shares", "sharing", "shared"], 
        correct: "shares",
        why: "Present Simple: Usamos la terminación 'S' porque 'She' es tercera persona del singular."
    },
    { 
        q: "We ______ (not / know) we were just kids.", 
        options: ["don't know", "doesn't know", "not know", "no know"], 
        correct: "don't know",
        why: "Present Simple Negative: Para 'We' usamos el auxiliar 'don't'."
    },
    { 
        q: "Does Ed Sheeran have ______ (much/many) love to give?", 
        options: ["much", "many", "a few", "any"], 
        correct: "much",
        why: "Uncountable: 'Love' es un sentimiento abstracto, por lo tanto es incontable y usamos 'much'."
    },
    { 
        q: "I found ______ girl, beautiful and sweet.", 
        options: ["a", "an", "some", "any"], 
        correct: "a",
        why: "Countable: 'Girl' es contable singular y empieza con consonante, por eso usamos 'a'."
    },
    { 
        q: "How ______ (much/many) secrets do they share?", 
        options: ["much", "many", "any", "a little"], 
        correct: "many",
        why: "Countable: 'Secrets' está en plural y se puede contar, por eso usamos 'many'."
    }
];

let currentIndex = 0;
let score = 0;
let userName = "";
let timer;
let timeLeft = 10;

function handleAdminLogin() {
    const pass = prompt("Enter Admin Password:");
    if (pass === "Ale333") {
        window.location.href = 'admin.htm';
    } else {
        alert("Incorrect Password!");
    }
}

function showInstructions() {
    userName = document.getElementById('username').value.trim();
    
    // 1. Validar que el campo no esté vacío
    if (!userName) {
        return alert("Please enter your name / Por favor ingresa tu nombre");
    }

    // 2. Obtener los resultados existentes del LocalStorage
    let results = JSON.parse(localStorage.getItem('perfectGame')) || [];

    // 3. Revisar si el nombre ya existe (ignorando mayúsculas/minúsculas)
    const nameExists = results.some(player => player.name.toLowerCase() === userName.toLowerCase());

    if (nameExists) {
        return alert("This name is already taken. Please use a different name or add a number. / Este nombre ya está en uso. Por favor usa otro o añade un número.");
    }

    // Si todo está bien, pasar a la pantalla de instrucciones
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
    const q = questions[currentIndex];
    const grid = document.getElementById('options-grid');
    let pointsGained = 0;
    let isCorrect = (choice === q.correct);

    if (isCorrect) {
        pointsGained = (timeLeft * 10) + 10;
        score += pointsGained;
    }

    // Bloquear botones para mostrar el feedback
    grid.innerHTML = `
        <div class="feedback-card ${isCorrect ? 'correct' : 'wrong'}">
            <h3>${isCorrect ? '¡Correcto! ✅' : 'Incorrecto ❌'}</h3>
            <p>Ganaste: ${pointsGained} pts</p>
            <small>${q.why}</small>
            <p style="font-size: 0.8rem; margin-top: 10px;">Next question in 3 seconds...</p>
        </div>
    `;

    document.getElementById('score-display').innerText = `${score} pts`;

    currentIndex++;
    setTimeout(() => {
        if (currentIndex < questions.length) {
            loadQuestion();
        } else {
            finishGame();
        }
    }, 3500); // 3.5 segundos para leer el feedback
}

function finishGame() {
    let results = JSON.parse(localStorage.getItem('perfectGame')) || [];
    results.push({ name: userName, score: score });
    localStorage.setItem('perfectGame', JSON.stringify(results));
    alert(`JUEGO TERMINADO\n${userName}, tu puntuación final es: ${score}`);
    location.reload();
}
