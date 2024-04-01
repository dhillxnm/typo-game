'use strict'

/*----------------------------------- */
/*------------Imported Files--------- */
/*----------------------------------- */

import { select, listen, getElement, selectAll, create } from './utils.js';
import { Score } from './score.js';

const startButton = document.getElementById('start-btn');
const hitsDisplay = document.getElementById('hits');
const timerDisplay = document.getElementById('timer');
const wordInput = document.getElementById('word-input');
const wordDisplay = document.getElementById('word');

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
let gameStarted = false; // Track if the game has started

startButton.addEventListener('click', startGame);

function startGame() {
  if (!gameStarted) {
      // First time starting the game
      gameStarted = true;
      startButton.textContent = 'Restart';

      // Remove the clock icon
      const clockIcon = document.querySelector('.clock i.fa-regular.fa-clock');
      if (clockIcon) {
          clockIcon.remove();
      }

      // Add background class to .clock element
      document.querySelector('.clock').classList.add('game-started');
  }

    hits = 0;
    remainingTime = 99;
    hitsDisplay.textContent = hits;
    timerDisplay.textContent = remainingTime;

    // Start background music
    backgroundMusic = new Audio('./assets/audio/mixkit-game-level-music-689.wav');
    backgroundMusic.loop = true;
    backgroundMusic.play();

    // Start timer
    timer = setInterval(updateTimer, 1000);

    // Randomize words
    const randomizedWords = words.sort(() => Math.random() - 0.5);

    // Display first word
    displayWord(randomizedWords.pop());

    // Enable input
    wordInput.disabled = false;

    // Add event listener to input
    wordInput.addEventListener('input', checkWord);

    // Disable start button
    startButton.disabled = true;
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

function checkWord() {
    const inputWord = wordInput.value.trim().toLowerCase();
    const currentWord = wordDisplay.textContent.toLowerCase();

    if (inputWord === currentWord) {
        hits++;
        hitsDisplay.textContent = hits;

        const randomizedWords = words.sort(() => Math.random() - 0.5);
        if (randomizedWords.length > 0) {
            displayWord(randomizedWords.pop());
            wordInput.value = ''; // Clear input field
        } else {
            endGame();
        }
        
        const successSound = new Audio('./assets/audio/mixkit-game-flute-bonus-2313.wav');
        successSound.play();
    }
}

function endGame() {
    clearInterval(timer);

    // Pause background music
    backgroundMusic.pause();

    // Disable input
    wordInput.disabled = true;
    
    // Calculate percentage
    const percentage = (hits / 90) * 100;

    // Create score object
    const date = new Date().toLocaleDateString();
    const score = new Score(date, hits, percentage);

    // Enable start button for new game
    startButton.disabled = false;
}
