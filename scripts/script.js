if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

let wordsData = {};
const languageSelection = document.getElementById('language-selection');
const levelSelection = document.getElementById('level-selection');
const flashcardContainer = document.getElementById('flashcard-container');
const flashcard = document.getElementById('flashcard');
const cardFront = document.getElementById('card-front');
const cardBack = document.getElementById('card-back');
const speakButton = document.getElementById('speak-button');
const nextCardButton = document.getElementById('next-card-button');
const previousCardButton = document.getElementById('previous-card-button');
const selectLevelButton = document.getElementById('select-level-button');
const languageSelect = document.getElementById('language-select');
let currentLevel = "";
let currentIndex = 0;

async function loadWordsData(language) {
    const response = await fetch(`/scripts/words/wordsData_${language}.json`); // Замените на правильный путь к вашим JSON-файлам
    wordsData = await response.json();
}

function getRandomWord(level) {
    const words = wordsData[level];
    currentIndex = Math.floor(Math.random() * words.length);
    return words[currentIndex];
}

function displayWord(level) {
    const word = getRandomWord(level);
    cardFront.innerHTML = `<div>${word.Слово}</div><div>${word.Транскрипция}</div>`;
    cardBack.innerHTML = `<div>${word.Перевод}</div>`;
}

function showNextWord() {
    currentIndex = (currentIndex + 1) % wordsData[currentLevel].length;
    const word = wordsData[currentLevel][currentIndex];
    cardFront.innerHTML = `<div>${word.Слово}</div><div>${word.Транскрипция}</div>`;
    cardBack.innerHTML = `<div>${word.Перевод}</div>`;
    flashcard.classList.remove('flip');
}

function showPreviousWord() {
    currentIndex = (currentIndex - 1 + wordsData[currentLevel].length) % wordsData[currentLevel].length;
    const word = wordsData[currentLevel][currentIndex];
    cardFront.innerHTML = `<div>${word.Слово}</div><div>${word.Транскрипция}</div>`;
    cardBack.innerHTML = `<div>${word.Перевод}</div>`;
    flashcard.classList.remove('flip');
}

languageSelect.addEventListener("change", () => {
    const selectedLanguage = languageSelect.value;
    loadWordsData(selectedLanguage).then(() => {
        languageSelection.classList.add('hidden');
        levelSelection.classList.remove('hidden');
        console.log('Words data loaded successfully for language:', selectedLanguage);
    }).catch(err => {
        console.error('Error loading words data:', err);
    });
});

document.querySelectorAll(".button").forEach((button) => {
    button.addEventListener("click", () => {
        currentLevel = button.getAttribute("data-level");
        languageSelection.classList.add('hidden');
        levelSelection.classList.add('hidden');
        flashcardContainer.classList.remove('hidden');
        displayWord(currentLevel);
    });
});

flashcard.addEventListener("click", () => {
    flashcard.classList.toggle("flip");
});

speakButton.addEventListener("click", () => {
    const firstDiv = cardFront.querySelector('div:first-child');
    const utterance = new SpeechSynthesisUtterance(
      firstDiv.textContent
    );
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  });

nextCardButton.addEventListener("click", showNextWord);
previousCardButton.addEventListener("click", showPreviousWord);

selectLevelButton.addEventListener("click", () => {
    flashcardContainer.classList.add('hidden');
    levelSelection.classList.remove('hidden');
    languageSelection.classList.remove('hidden');
});

// Загрузка данных для Украинского языка по умолчанию
document.addEventListener('DOMContentLoaded', () => {
    const selectedLanguage = languageSelect.value;
    loadWordsData(selectedLanguage).then(() => {
        console.log('Words data loaded successfully for default language:', selectedLanguage);
        languageSelection.classList.remove('hidden');
        levelSelection.classList.remove('hidden');
    }).catch(err => {
        console.error('Error loading words data:', err);
    });
});
