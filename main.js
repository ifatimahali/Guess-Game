const phrases = {
    easy: [
        { text: "كاس العالم", image: "easy1-removebg-preview.png" },
        { text: "كريم بنزيما", image: "easy2-removebg-preview.png" },
        { text: "تويكس", image: "easy3-removebg-preview.png" }
    ],
    medium: [
        { text: "صداع نصفي", image: "mediam-removebg-preview.png" },
        { text: "حارس", image: "meadiam2-removebg-preview.png" },
        { text: "حلقات البصل", image: "meadiam3-removebg-preview.png" }
    ],
    hard: [
        { text: "كيجن", image: "hard-removebg-preview.png" },
        { text: "مالديف", image: "hard2-removebg-preview.png" },
        { text: "حراسه مشدده", image: "hard3-removebg-preview.png" }
    ]
};

const pointsPerStage = 15;
const pointsRequired = 30;

let currentPhrase = "";
let guessedLetters = [];
let score = 0;
let stage = 1;
let currentLevel = "";
let attempts = 0;
const maxAttempts = 6;

function startGame(level) {
    currentLevel = level;
    stage = 1;
    score = 0;
    startStage();
}

function startStage() {
    const phraseList = phrases[currentLevel];
    const selectedPhrase = phraseList[stage - 1];
    currentPhrase = selectedPhrase.text;
    guessedLetters = Array.from(currentPhrase).map(char => (char === ' ' ? ' ' : '_'));
    attempts = 0;
    document.getElementById('level-selection').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    document.getElementById('message').style.display = 'none';
    document.getElementById('stage').textContent = `المرحلة: ${stage}`;
    document.getElementById('level').textContent = `المستوى: ${currentLevel}`;
    document.getElementById('score').textContent = `النقاط: ${score}`;
    displayImage(selectedPhrase.image);
    displayPhrase();
    generateLetterButtons();
}
function displayImage(imagePath) {
    const imageContainer = document.getElementById('image-container');
    imageContainer.innerHTML = `<img src="${imagePath}">`;
}
function displayPhrase() {
    const phraseContainer = document.getElementById('phrase-container');
    phraseContainer.textContent = guessedLetters.join(' ');
}
function generateLetterButtons() {
    const lettersContainer = document.getElementById('letters-container');
    lettersContainer.innerHTML = '';
    const letters = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي".split('');
    letters.forEach(letter => {
        const button = document.createElement('button');
        button.textContent = letter;
        button.onclick = () => guessLetter(letter);
        lettersContainer.appendChild(button);
    });
}
function guessLetter(letter) {
    let correctGuess = false;
    for (let i = 0; i < currentPhrase.length; i++) {
        if (currentPhrase[i] === letter) {
            guessedLetters[i] = letter;
            correctGuess = true;
        }
    }
    if (!correctGuess) {
        attempts++;
    }
    displayPhrase();
    if (guessedLetters.join('') === currentPhrase) {
        score += pointsPerStage;
        document.getElementById('score').textContent = `النقاط: ${score}`; 
        if (stage === 3) {
            if (score >= pointsRequired) {
                if (currentLevel === 'easy') {
                    currentLevel = 'medium';
                } else if (currentLevel === 'medium') {
                    currentLevel = 'hard';
                } else {
                    displayResults();
                    return;
                }
                stage = 1;
                showLevelUpAnimation();
                setTimeout(() => {
                    displayMessage(`مبروك! انتقلت إلى المستوى ${currentLevel}`, true);
                    setTimeout(startStage, 4000);
                }, 4000);
            } else {
                displayMessage("🤨حظًا أوفر! لم تجمع نقاط كافية للانتقال للمستوى التالي.", false);
                setTimeout(() => {
                    window.location.href = 'levels.html';
                }, 4000);
            }
        } else {
            playClapSound();
            showWinAnimation();
            stage++;
            setTimeout(startStage, 7000);
        }
    } else if (attempts >= maxAttempts) {
        displayMessage("حظ اوفر حاول مرة اخرى🥹.", false);
        showLoseAnimation();
        setTimeout(startStage, 7000);
    }
}
function displayMessage(message, isWin) {
    const messageContainer = document.getElementById('message');
    messageContainer.textContent = message;
    messageContainer.style.display = 'block';

    if (isWin) {
        if (currentLevel === 'hard' && stage === 3) {
            if (score >= pointsRequired) {
                messageContainer.textContent += " ✌️مبروك عليك الفل مارك!";
            }
        }
    } else {
        const audio = new Audio('lose.wav');
        audio.play();
    }
}
function playClapSound() {
    const clapSound = document.getElementById('clap-sound');
    clapSound.play();
}
function showWinAnimation() {
    const animationContainer = document.getElementById('animation');
    animationContainer.style.display = 'block';
    playClapSound();
    setTimeout(() => {
        animationContainer.style.display = 'none';
    }, 7000);
}

function showLevelUpAnimation() {
    const levelUpAnimationContainer = document.getElementById('level-up-animation');
    levelUpAnimationContainer.style.display = 'block';
    playClapSound();
    setTimeout(() => {
        levelUpAnimationContainer.style.display = 'none';
    }, 7000);
}
function showLoseAnimation() {
    const animationContainer = document.getElementById('lose-animation');
    animationContainer.style.display = 'block';
    playLoseSound();
    setTimeout(() => {
        animationContainer.style.display =
        'none';
    }, 7000);
}
function playLoseSound() {
    const loseSound = document.getElementById('lose-sound');
    loseSound.play();
}
function displayResults() {
    document.getElementById('game').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    document.getElementById('final-score').textContent = `النتيجة النهائية: ${score}`;
    document.getElementById('correct-answers').textContent = `عدد الإجابات الصحيحة: ${Math.floor(score / pointsPerStage)}`;
}
function replay() {
    window.location.reload();
}
function goHome() {
    window.location.href = 'index.html';
}
function goBack(){
    window.location.href = 'levels.html';
}