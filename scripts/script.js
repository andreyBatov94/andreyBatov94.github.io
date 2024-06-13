if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => console.log('ServiceWorker зарегистрирован: ', registration.scope))
            .catch(err => console.log('ServiceWorker ошибка регистрации: ', err));
    });
}

const {
    languageSelection,
    levelSelection,
    flashcardContainer,
    flashcard,
    cardFront,
    cardBack,
    speakButton,
    nextCardButton,
    previousCardButton,
    selectLevelButton,
    languageSelect
} = {
    languageSelection: document.getElementById('language-selection'),
    levelSelection: document.getElementById('level-selection'),
    flashcardContainer: document.getElementById('flashcard-container'),
    flashcard: document.getElementById('flashcard'),
    cardFront: document.getElementById('card-front'),
    cardBack: document.getElementById('card-back'),
    speakButton: document.getElementById('speak-button'),
    nextCardButton: document.getElementById('next-card-button'),
    previousCardButton: document.getElementById('previous-card-button'),
    selectLevelButton: document.getElementById('select-level-button'),
    languageSelect: document.getElementById('language-select')
};

let wordsData = {};
let currentLevel = "";
let currentIndex = 0;

async function loadWordsData(language) {
    try {
        const response = await fetch(`/scripts/words/wordsData_${language}.json`);
        wordsData = await response.json();
        console.log('Успешная загрузка списка слова для выбранного языка:', language);
    } catch (err) {
        console.error('Ошибка загрузки списка слов для выбранного языка:', err);
    }
}

function updateFlashcard(word) {
    cardFront.innerHTML = `<div>${word.Слово}</div><div>${word.Транскрипция}</div>`;
    cardBack.innerHTML = `<div>${word.Перевод}</div>`;
}

function getRandomWord(level) {
    const words = wordsData[level];
    currentIndex = Math.floor(Math.random() * words.length);
    return words[currentIndex];
}

function displayWord(level) {
    const word = getRandomWord(level);
    updateFlashcard(word);
}

function showNextWord() {
    currentIndex = (currentIndex + 1) % wordsData[currentLevel].length;
    updateFlashcard(wordsData[currentLevel][currentIndex]);
    flashcard.classList.remove('flip');
}

function showPreviousWord() {
    currentIndex = (currentIndex - 1 + wordsData[currentLevel].length) % wordsData[currentLevel].length;
    updateFlashcard(wordsData[currentLevel][currentIndex]);
    flashcard.classList.remove('flip');
}

languageSelect.addEventListener("change", () => {
    const selectedLanguage = languageSelect.value;
    loadWordsData(selectedLanguage).then(() => {
        languageSelection.classList.add('hidden');
        levelSelection.classList.remove('hidden');
    });
});

document.querySelectorAll(".button").forEach(button => {
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
    const utterance = new SpeechSynthesisUtterance(firstDiv.textContent);
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

document.addEventListener('DOMContentLoaded', () => {
    const selectedLanguage = languageSelect.value;
    loadWordsData(selectedLanguage).then(() => {
        languageSelection.classList.remove('hidden');
        levelSelection.classList.remove('hidden');
    });
});
