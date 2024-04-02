'use strict'

/*----------------------------------- */
/*------------Imported Files--------- */
/*----------------------------------- */
import { select, listen, getElement, selectAll, create } from './utils.js';
import { Score } from './score.js'; 


/*----------------------------------- */
/*----------------DOM---------------- */
/*----------------------------------- */
const startButton = getElement('start-btn');
const hitsDisplay = getElement('hits');
const timerDisplay = getElement('timer');
const wordInput = getElement('word-input');
const wordDisplay = getElement('word');


/*----------------------------------- */
/*----------------Array-------------- */
/*----------------------------------- */
const words = ['dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building', 'population',
'weather', 'bottle', 'history', 'dream', 'character', 'money', 'absolute',
'discipline', 'machine', 'accurate', 'connection', 'rainbow', 'bicycle',
'eclipse', 'calculator', 'trouble', 'watermelon', 'developer', 'philosophy',
'database', 'periodic', 'capitalism', 'abominable', 'component', 'future',
'pasta', 'microwave', 'jungle', 'wallet', 'canada', 'coffee', 'beauty', 'agency',
'chocolate', 'eleven', 'technology', 'alphabet', 'knowledge', 'magician',
'professor', 'triangle', 'earthquake', 'baseball', 'beyond', 'evolution',
'banana', 'perfumer', 'computer', 'management', 'discovery', 'ambition', 'music',
'eagle', 'crown', 'chess', 'laptop', 'bedroom', 'delivery', 'enemy', 'button',
'superman', 'library', 'unboxing', 'bookstore', 'language', 'homework',
'fantastic', 'economy', 'interview', 'awesome', 'challenge', 'science', 'mystery',
'famous', 'league', 'memory', 'leather', 'planet', 'software', 'update', 'yellow',
'keyboard', 'window'];


let timer;
let hits = 0;
let remainingTime = 99;
let backgroundMusic;
let gameStarted = false;


/*----------------------------------- */
/*----------------start-------------- */
/*----------------------------------- */
function startGame() {
    if (!gameStarted) {
        initializeGame();
    }
    resetGame();
    startBackgroundMusic();
    startTimer();
    displayRandomWord();
    enableInput();
    disableStartButton();
}


function initializeGame() {
    gameStarted = true;
    startButton.textContent = 'Restart';
    removeClockIcon();
    addGameStartedClass();
    const wordInputElement = document.getElementById('word-input');
    if (wordInputElement) {
        wordInputElement.placeholder = 'Enter word';
    }
}


function resetGame() {
    hits = 0;
    remainingTime = 99;
    hitsDisplay.textContent = hits;
    timerDisplay.textContent = remainingTime;
    wordInput.value = ''; 
}


function startBackgroundMusic() {
    backgroundMusic = new Audio('./assets/audio/mixkit-game-level-music-689.wav');
    backgroundMusic.loop = true;
    backgroundMusic.play();
}


function startTimer() {
    timer = setInterval(updateTimer, 1000);
}

function displayRandomWord() {
    const randomizedWords = words.sort(() => Math.random() - 0.5);
    displayWord(randomizedWords.pop());
}


function enableInput() {
    wordInput.disabled = false;
    wordInput.addEventListener('input', checkWord);
}


function disableStartButton() {
    startButton.disabled = true;
}


function removeClockIcon() {
    const clockIcon = select('.clock i.fa-regular.fa-clock');
    if (clockIcon) {
        clockIcon.remove();
    }
}


function addGameStartedClass() {
    select('.clock').classList.add('game-started');
}


function updateTimer() {
    remainingTime--;
    timerDisplay.textContent = remainingTime;
    if (remainingTime === 0) {
        endGame();
    }
}


function displayWord(word) {
    wordDisplay.textContent = word;
}



/*----------------------------------- */
/*-------------validation------------ */
/*----------------------------------- */
function checkWord() {
    const inputWord = wordInput.value.trim().toLowerCase();
    const currentWord = wordDisplay.textContent.toLowerCase();

    if (inputWord === currentWord) {
        hits++;
        hitsDisplay.textContent = hits;

        const randomizedWords = words.sort(() => Math.random() - 0.5);
        if (randomizedWords.length > 0) {
            displayWord(randomizedWords.pop());
            wordInput.value = '';
        } else {
            endGame();
        }
        const successSound = new Audio('./assets/audio/mixkit-game-flute-bonus-2313.wav');
        successSound.play();
    }
}


/*----------------------------------- */
/*-----------------end--------------- */
/*----------------------------------- */
function endGame() {
    clearInterval(timer);
    backgroundMusic.pause();
    wordInput.disabled = true;
    const percentage = (hits / 90) * 100;
    const date = new Date().toLocaleDateString();
    const score = new Score(date, hits, percentage);
    startButton.disabled = false;
}


listen('click', startButton, startGame);