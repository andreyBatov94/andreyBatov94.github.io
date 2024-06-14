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
    wordSelection,
    flashcardContainer,
    flashcard,
    cardFront,
    cardBack,
    speakButton,
    nextCardButton,
    previousCardButton,
    startFlashcardsButton,
    backToLevelSelectionButton,
    selectLevelButton,
    languageSelect,
    wordsContainer,
    prevPageButton,
    nextPageButton,
    pageInfo,
    selectAllPageButton, //all select
    selectAllLevelButton //all select
} = {
    languageSelection: document.getElementById('language-selection'),
    levelSelection: document.getElementById('level-selection'),
    wordSelection: document.getElementById('word-selection'),
    flashcardContainer: document.getElementById('flashcard-container'),
    flashcard: document.getElementById('flashcard'),
    cardFront: document.getElementById('card-front'),
    cardBack: document.getElementById('card-back'),
    speakButton: document.getElementById('speak-button'),
    nextCardButton: document.getElementById('next-card-button'),
    previousCardButton: document.getElementById('previous-card-button'),
    startFlashcardsButton: document.getElementById('start-flashcards-button'),
    backToLevelSelectionButton: document.getElementById('back-to-level-selection-button'),
    selectLevelButton: document.getElementById('select-level-button'),
    languageSelect: document.getElementById('language-select'),
    wordsContainer: document.getElementById('words-container'),
    prevPageButton: document.getElementById('prev-page-button'),
    nextPageButton: document.getElementById('next-page-button'),
    pageInfo: document.getElementById('page-info'),
    selectAllPageButton: document.getElementById('select-all-page'),  //all select
    selectAllLevelButton: document.getElementById('select-all-level') //all select
};

let wordsData = {};
let currentLevel = "";
let selectedWords = [];
let currentIndex = 0;
let currentPage = 1;
const wordsPerPage = 15;

async function loadWordsData(language) {
    try {
        const response = await fetch(`/scripts/words/wordsData_${language}.json`);
        wordsData = await response.json();
        console.log('Успешная загрузка списка слов для выбранного языка:', language);
    } catch (err) {
        console.error('Ошибка загрузки списка слов для выбранного языка:', err);
    }
}

function displayWordsForSelection(level, page = 1) {
    wordsContainer.innerHTML = '';
    const words = wordsData[level];
    if (!words) {
        console.error(`Слова для уровня ${level} не найдены`);
        return;
    }
    currentPage = page;
    const start = (page - 1) * wordsPerPage;
    const end = Math.min(start + wordsPerPage, words.length);
    for (let i = start; i < end; i++) {
        const word = words[i];
        const wordItem = document.createElement('div');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `word-${i}`;
        checkbox.value = i;
        wordItem.appendChild(checkbox);
        const label = document.createElement('label');
        label.htmlFor = `word-${i}`;
        label.textContent = word.Слово;
        wordItem.appendChild(label);
        wordsContainer.appendChild(wordItem);
    }
    pageInfo.textContent = `Страница ${page} из ${Math.ceil(words.length / wordsPerPage)}`;
}

function getSelectedWords() {
    const checkboxes = wordsContainer.querySelectorAll('input[type="checkbox"]:checked');
    selectedWords = Array.from(checkboxes).map(checkbox => wordsData[currentLevel][checkbox.value]);
}

function updateFlashcard(word) {
    cardFront.innerHTML = `<div>${word.Слово}</div><div>${word.Транскрипция}</div>`;
    cardBack.innerHTML = `<div>${word.Перевод}</div>`;
}

function displayWord() {
    const word = selectedWords[currentIndex];
    updateFlashcard(word);
}

function showNextWord() {
    currentIndex = (currentIndex + 1) % selectedWords.length;
    displayWord();
    flashcard.classList.remove('flip');
}

function showPreviousWord() {
    currentIndex = (currentIndex - 1 + selectedWords.length) % selectedWords.length;
    displayWord();
    flashcard.classList.remove('flip');
}
/*All select start */
function selectAllWordsOnPage() {
    const checkboxes = wordsContainer.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = true);
}

function selectAllWordsInLevel() {
    selectedWords = wordsData[currentLevel].slice();
    displayWordsForSelection(currentLevel, currentPage);
}
/*All select end*/

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
        displayWordsForSelection(currentLevel);
        levelSelection.classList.add('hidden');
        wordSelection.classList.remove('hidden');
        languageSelection.classList.add('hidden');
    });
});

startFlashcardsButton.addEventListener("click", () => {
    getSelectedWords();
    wordSelection.classList.add('hidden');
    flashcardContainer.classList.remove('hidden');
    displayWord();
});

backToLevelSelectionButton.addEventListener("click", () => {
    wordSelection.classList.add('hidden');
    levelSelection.classList.remove('hidden');
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
    wordSelection.classList.add('hidden');
    languageSelection.classList.remove('hidden');
});

prevPageButton.addEventListener("click", () => {
    if (currentPage > 1) {
        displayWordsForSelection(currentLevel, currentPage - 1);
    }
});

nextPageButton.addEventListener("click", () => {
    const totalPages = Math.ceil(wordsData[currentLevel].length / wordsPerPage);
    if (currentPage < totalPages) {
        displayWordsForSelection(currentLevel, currentPage + 1);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const selectedLanguage = languageSelect.value;
    loadWordsData(selectedLanguage).then(() => {
        languageSelection.classList.remove('hidden');
        levelSelection.classList.remove('hidden');
    });
});

selectAllPageButton.addEventListener("click", selectAllWordsOnPage); //all select
