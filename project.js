const texts = [
    "The quick brown fox jumps over the lazy dog. This sentence obtains every letter of the English alphabet atleast once. It is often used for testing fonts and keyboards. It is a pangram, which is a sentence that uses every letter of the alphabet.",
    "Pack my box with five dozen liquor jugs. This playful pangram includes every letter of the alphabet in just one short sentence. It is commonly used for testing typewriters, keyboards, and display fonts.",
    "Waltz, bad nymph, for quick jigs vex. This short and quirky pangram is perfect for checking font alignment and keystroke accuracy, as it squeezes every letter into just a few words.",
    "Sphinx of black quartz, judge my vow. This smooth-flowing pangram feels like a line from a mysterious poem, yet it includes all the letters of the English alphabet, making it ideal for typing practice.",
    "The five boxing wizards jump quickly. This sentence contains every letter, offering a snappy rhythm for speed typing and an easy way to spot errors in keyboard input.",
    "How vexingly quick daft zebras jump! This energetic pangram has a sense of motion and fun, while still serving the practical purpose of testing fonts, layouts, and typing accuracy.",
];

let currentText = '';
let timer = 60;
let timerInterval = null;
let gameStarted = false;
let correctChars = 0;
let incorrectChars = 0;
let currentIndex = 0;
let typedHistory = [];

const textDisplay = document.getElementById('textDisplay');
const inputField = document.getElementById('inputfield'); // note: matches HTML id="inputfield"
const timerDisplay = document.getElementById('timer');
const wpmStat = document.getElementById('wpmStat');
const accuracyStat = document.getElementById('accuracyStat');
const charsStat = document.getElementById('charsStat');
const restartBtn = document.getElementById('restartBtn');
const newTextBtn = document.getElementById('newTextBtn');
const resultsModal = document.getElementById('resultsModal');

function init() {
    setNewText();
    inputField.value = '';
    inputField.disabled = false;
    gameStarted = false;
    correctChars = 0;
    incorrectChars = 0;
    currentIndex = 0;
    typedHistory = [];
    timer = 60;
    updateStats();
    updateTimer();
    resultsModal.classList.remove('active');
}

function setNewText() {
    currentText = texts[Math.floor(Math.random() * texts.length)];
    displayText();
}

function displayText(){
    textDisplay.innerHTML = currentText.split('').map((char, index) => {
        return `<span id="char${index}">${char}</span>`;
    }).join('');
    
    currentIndex = 0;
    highlightCurrentChar();
}

function highlightCurrentChar() {
    const prevChar = document.querySelector('.current');
    if (prevChar) prevChar.classList.remove('current');
    const currentChar = document.getElementById(`char${currentIndex}`);
    if (currentChar) currentChar.classList.add('current');
}

function startTimer() {
    timerInterval = setInterval(() => {
        timer--;
        updateTimer();
        if (timer <= 0) {
            endGame();
        }
    }, 1000);
}

function updateTimer() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function calculateWPM() {
    const words = correctChars / 5;
    const minutes = (60 - timer) / 60;
    return Math.round(words / Math.max(minutes, 0.01));
}

function calculateAccuracy() {
    const totalChars = correctChars + incorrectChars;
    return totalChars === 0 ? 100 : Math.round((correctChars / totalChars) * 100);
}

function updateStats() {
    wpmStat.textContent = calculateWPM();
    accuracyStat.textContent = `${calculateAccuracy()}%`;
    charsStat.textContent = correctChars;
}

function resetCharState(index) {
    const charElement = document.getElementById(`char${index}`);
    if (charElement) {
        charElement.classList.remove('correct', 'incorrect');
    }
}

inputField.addEventListener('input', (e) => {
    if (!gameStarted && e.target.value.length > 0) {
        gameStarted = true;
        startTimer();
        textDisplay.classList.add('active');
    }

    const inputValue = e.target.value;
    const backSpace = typedHistory.length > inputValue.length;

    if (backSpace) {
        if (currentIndex > 0) {
            currentIndex--;
            resetCharState(currentIndex);
            if (typedHistory[currentIndex]) {
                correctChars--;
            } else {
                incorrectChars--;
            }

            typedHistory = typedHistory.slice(0, currentIndex);
        }
    } else {
        if (currentIndex < currentText.length) {
            const currentChar = document.getElementById(`char${currentIndex}`);
            const expectedChar = currentText[currentIndex];
            const typedChar = inputValue[inputValue.length - 1];

            if (typedChar === expectedChar) {
                currentChar.classList.add('correct');
                correctChars++;
                typedHistory[currentIndex] = true;
            } else {
                currentChar.classList.add('incorrect');
                incorrectChars++;
                typedHistory[currentIndex] = false;
            }
            currentIndex++;
        }
    }

    typedHistory = typedHistory.slice(0, inputValue.length);

    highlightCurrentChar();
    updateStats();

    if (currentIndex >= currentText.length) {
        endGame();
    }
});

inputField.addEventListener('keydown', (e) => {
    if (['ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
        e.preventDefault();
    }
});

function endGame() {
    clearInterval(timerInterval);
    inputField.disabled = true;
    textDisplay.classList.remove('active');

    document.getElementById('finalWPM').textContent = calculateWPM();
    document.getElementById('finalAccuracy').textContent = `${calculateAccuracy()}%`;
    document.getElementById('finalChars').textContent = correctChars;
    document.getElementById('finalErrors').textContent = incorrectChars;

    resultsModal.classList.add('active');
}

function restartTest() {
    clearInterval(timerInterval);
    init();
}

restartBtn.addEventListener('click', restartTest);
newTextBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to change the text? Your current progress will be lost.")) {
        restartTest();
    }
});

textDisplay.addEventListener('copy', e => e.preventDefault());
textDisplay.addEventListener('mousedown', e => e.preventDefault());

init();
