'use strict';

/*------------------------------------------ */
/*------------Imported-Files---------------- */
/*------------------------------------------ */

import { select, listen, getElement, selectAll, create } from './utils.js';
import { Score} from './score.js';


/*------------------------------------------ */
/*-----------------DOM---------------------- */
/*------------------------------------------ */

const word = select("#word");
const startBtn = select("#start-btn-top-left");
const text = select("#text");
const scoreElement = select("#score");
const timeElement = select("#time");
const endGameElement = select("#end-game-container");
const backgroundMusic = select("#background-music");
const scoreboardContainer = select("#scoreboard-container");
const scoreBoard = getElement('show-scoreboard-btn');
const clearScoreboardButton = getElement('clear-scoreboard-btn');
const restartButton = getElement('restart-btn');



/*------------------------------------------ */
/*-----------------Array-------------------- */
/*------------------------------------------ */
const words = [
    'dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building',
    'population', 'weather', 'bottle', 'history', 'dream', 'character', 'money',
    'absolute', 'discipline', 'machine', 'accurate', 'connection', 'rainbow',
    'bicycle', 'eclipse', 'calculator', 'trouble', 'watermelon', 'developer',
    'philosophy', 'database', 'periodic', 'capitalism', 'abominable',
    'component', 'future', 'pasta', 'microwave', 'jungle', 'wallet', 'canada',
    'coffee', 'beauty', 'agency', 'chocolate', 'eleven', 'technology', 'promise',
    'alphabet', 'knowledge', 'magician', 'professor', 'triangle', 'earthquake',
    'baseball', 'beyond', 'evolution', 'banana', 'perfume', 'computer',
    'management', 'discovery', 'ambition', 'music', 'eagle', 'crown', 'chess',
    'laptop', 'bedroom', 'delivery', 'enemy', 'button', 'superman', 'library',
    'unboxing', 'bookstore', 'language', 'homework', 'fantastic', 'economy',
    'interview', 'awesome', 'challenge', 'science', 'mystery', 'famous',
    'league', 'memory', 'leather', 'planet', 'software', 'update', 'yellow',
    'keyboard', 'window', 'beans', 'truck', 'sheep', 'band', 'level', 'hope',
    'download', 'blue', 'actor', 'desk', 'watch', 'giraffe', 'brazil', 'mask',
    'audio', 'school', 'detective', 'hero', 'progress', 'winter', 'passion',
    'rebel', 'amber', 'jacket', 'article', 'paradox', 'social', 'resort', 'escape'
];

let wordsCopy = [...words]; 
let randomWord;
let score = 0;
let gameStarted = false; 
let time = 15; 
let timeInterval = setInterval(timeDecline, 1500); 
let scores = JSON.parse(localStorage.getItem('scores')) || [];


/*------------------------------------------ */
/*-------------typing-section--------------- */
/*------------------------------------------ */
// function inputFocus(event) {
//     if (event.target !== text) {
//         text.focus();
//     }
// }


function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * wordsCopy.length);
    return wordsCopy.splice(randomIndex, 1)[0];
}


function addWordToElement() {
    if (gameStarted) {
        randomWord = getRandomWord();
        word.innerHTML = randomWord;
    }
}


function timeDecline() {
    if (gameStarted) {
        if (time > 0) {
            time--;
            const timeDisplay = getElement('time');
            timeDisplay.innerHTML = time + "s";
        } else {
            gameOver();
            clearInterval(timeInterval);
        }
    }
}



function displayCountDown() {
    let countdown = 3;
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown === 0) {
            clearInterval(countdownInterval);
            backgroundMusic.play(); 
            timeInterval = setInterval(timeDecline, 10000);
            gameStarted = true;
        }
    }, 1000);
}


function startGame() {
    score = 0;
    wordsCopy = [...words];
    gameStarted = true;
    addWordToElement();
    restartButton.classList.add('hide');
    endGameElement.style.display = 'none';
    scoreElement.innerHTML = score;
    listen('input', text,  addRandomWords);
}


function updateHits() {
    score++;
    scoreElement.innerHTML = score;
}



listen('click', startBtn, () => {
    displayCountDown();
    setTimeout(startGame, 3000); 
    text.focus();
});



function addRandomWords(newWord) {
    const insertedText = newWord.target.value;
    const validInput = /^[a-zA-Z ]*$/.test(insertedText); 
    if (validInput) {
        const cleanedText = insertedText.trim().toLowerCase();
        if (cleanedText === randomWord) {
            addWordToElement();
            updateHits();
            newWord.target.value = '';
        }
    } else {
        newWord.target.value = '';
    }
}

/*------------------------------------------ */
/*-------------Game-over section------------ */
/*------------------------------------------ */

function gameOver() {
    pauseBackgroundMusic();
    displayEndGameMessage();
    removeTextInputListener();
    displayScoreBoard();
    displayRestartButton();
    displayEndGameContainer();
    updateGameStatus();
    saveFinalScore();
    updateUI();
}

function pauseBackgroundMusic() {
    backgroundMusic.pause();
}


function displayEndGameMessage() {
    if (wordsCopy.length === 0) {
        endGameElement.innerHTML = `
            <h1 class="congratulations">!You Win!</h1>
            <p class="finalScore">Your final score is: ${score}</p>
        `;
    } else {
        endGameElement.innerHTML = `
            <h1 class="congratulations">Time Out</h1>
            <p class="finalScore">Your final score is: ${score}</p>
        `;
    }
}


function removeTextInputListener() {
    text.removeEventListener('input', addRandomWords);
}


function displayScoreBoard() {
    scoreBoard.style.display = 'block';
}


function displayRestartButton() {
    const restartButton = document.getElementById('restart-btn');
    restartButton.classList.remove('hide');
}


function displayEndGameContainer() {
    endGameElement.style.display = "flex";
}


function updateGameStatus() {
    gameStarted = true;
}


function saveFinalScore() {
    saveScore({ hits: score, percentage: calculatePercentage(score, words.length), date: new Date() });
}


function updateUI() {
    scoreElement.innerHTML = score;
    timeElement.innerHTML = time + "s";
    scoreBoard.classList.remove('hide');
}


/*------------------------------------------ */
/*-------------Game-scores locally---------- */
/*------------------------------------------ */

function saveScore(scoreObj) {
    const existingScoreIndex = findExistingScoreIndex(scoreObj);

    if (existingScoreIndex === -1) {
        addNewScore(scoreObj);
    } else {
        updateExistingScore(existingScoreIndex, scoreObj);
    }

    sortScores();
    limitScores();
    storeScoresInLocalStorage();
    displayScoreboard();
}


function findExistingScoreIndex(scoreObj) {
    return scores.findIndex(
        (score) =>
            score.hits === scoreObj.hits &&
            score.percentage === scoreObj.percentage
    );
}


function addNewScore(scoreObj) {
    scores.push(scoreObj);
}


function updateExistingScore(index, scoreObj) {
    if (
        scoreObj.hits > scores[index].hits ||
        (scoreObj.hits === scores[index].hits &&
            scoreObj.date > scores[index].date)
    ) {
        scores[index] = scoreObj;
    }
}


function sortScores() {
    scores.sort((a, b) => {
        if (b.hits !== a.hits) {
            return b.hits - a.hits;
        } else {
            return a.date - b.date;
        }
    });
}


function limitScores() {
    scores = scores.slice(0, 10);
}


function storeScoresInLocalStorage() {
    localStorage.setItem('scores', JSON.stringify(scores));
}


function calculatePercentage(hits, totalWords) {
    return (hits / totalWords) * 100;
}


/*------------------------------------------ */
/*-----------------Score-Board-------------- */
/*------------------------------------------ */
function displayScoreboard() {
    clearScoreboardContainer();
    if (scores.length === 0) {
        displayNoScoresMessage();
    } else {
        displayHeader();
        displayScoreList();
    }
}


function clearScoreboardContainer() {
    scoreboardContainer.innerHTML = '';
}


function displayNoScoresMessage() {
    const noScoresMessage = document.createElement('p');
    noScoresMessage.id = 'no-scores';
    noScoresMessage.textContent = 'No games have been played yet.';
    scoreboardContainer.appendChild(noScoresMessage);
}


function displayHeader() {
    const header = document.createElement('h2');
    header.textContent = 'High Scores';
    scoreboardContainer.appendChild(header);
}


function displayScoreList() {
    const scoreboardList = document.createElement('ul');
    scores.forEach((score, index) => {
        const listItem = createScoreListItem(score, index);
        scoreboardList.appendChild(listItem);
    });
    scoreboardContainer.appendChild(scoreboardList);
}


function createScoreListItem(score, index) {
    const listItem = document.createElement('li');
    const formattedDateTime = formatDateTime(score.date);
    listItem.textContent = `# ${index + 1} \u00A0 ${score.hits} words \u00A0 
    ${score.percentage.toFixed(2)}% \u00A0 ${formattedDateTime}`;
    return listItem;
}


function formatDateTime(date) {
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    };
    return date.toLocaleString(undefined, options);
}


function toggleScoreboard() {
    scoreboardContainer.style.display = (scoreboardContainer.style.display === 'block') ? 'none' : 'block';
    if (scoreboardContainer.style.display === 'block') {
        displayScoreboard();
    }
}   


function clearScoreboard() {
    if (scores.length <= 1) {
        return;
    }
    localStorage.removeItem('scores');
    scores = [];
    displayScoreboard();
}


/*------------------------------------------ */
/*-----------------Restart-game-------------- */
/*------------------------------------------ */
function restartGame() {
    if (gameStarted) {
        clearInterval(timeInterval);
        resetLocalStorage();
        resetGameVariables();
        hideElements();
        updateUI();
        displayCountDown();
    }
}

function resetLocalStorage() {
    localStorage.removeItem('scores');
}

function resetGameVariables() {
    score = 0;
    time = 15;
    wordsCopy = [...words];
    addWordToElement();
}

function hideElements() {
    scoreboardContainer.style.display = 'none';
    restartButton.classList.add('hide');
    endGameElement.style.display = 'none';
    clearScoreboardButton.style.display = 'none';
}



scoreBoard.addEventListener('click', toggleScoreboard);

scoreBoard.addEventListener('click', function () {
    clearScoreboardButton.style.display = 'block';
});



text.addEventListener("input", (e) => {
    const insertedText = e.target.value;

    const validInput = /^[a-zA-Z ]*$/.test(insertedText);

    if (validInput && gameStarted) {
        const cleanedText = insertedText.trim().toLowerCase();

        if (cleanedText === randomWord) {
            addWordToElement();
            updateHits();

            e.target.value = "";
        }
    } else {
        e.target.value = "";
    }
});

const countdownOverlay = document.getElementById('countdown-overlay');
const countdownElement = document.getElementById('countdown');
const readyElement = document.getElementById('ready');
const setElement = document.getElementById('set');
const goElement = document.getElementById('go');


function startCountdown() {
    startBtn.disabled = true;
    startBtn.style.display = "none";
    countdownOverlay.classList.remove('hide'); 
    runCountdown(3);
}

function runCountdown(seconds) {
    let currentCount = seconds;

    function updateCountdown() {
        countdownElement.textContent = currentCount;

        if (currentCount === 2) {
            readyElement.style.display = 'block';
        } else if (currentCount === 1) {
            readyElement.style.display = 'none';
            setElement.style.display = 'block';
        } else if (currentCount === 0) {
            setElement.style.display = 'none';
            goElement.style.display = 'block';
        } else if (currentCount < 0) {
            countdownOverlay.classList.add('hide');
            goElement.style.display = 'none';
            displayCountDown();
            countdownOverlay.style.display = 'none';
            return;
        }

        setTimeout(updateCountdown, 1000);
        currentCount--;
    }

    updateCountdown();
}


listen('click', scoreBoard, toggleScoreboard);
listen('click', clearScoreboardButton, clearScoreboard);
listen('click', restartButton, restartGame);   

startBtn.addEventListener('click', startCountdown);
startBtn.addEventListener('click', displayCountDown);