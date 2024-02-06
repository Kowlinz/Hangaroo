const hangarooImage = document.querySelector(".hangaroo-box img");
const wordDisplay = document.querySelector(".word-display");
const guessText = document.querySelector(".guesses-text b");
const pointsText = document.querySelector(".points-text b");
const keyboardDiv = document.querySelector(".keyboard");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = document.querySelector(".play-again");
const vowelClueButton = document.getElementById("vowel-clue");
const consonantClueButton = document.getElementById("consonant-clue");

let currentWord, correctLetters, wrongGuessCount, points = 0, currentWordIndex;
const maxGuess = 3;
const pointsPerWord = 10;
let remainingClues = 3;
let lastVowelClue = '';
let lastConsonantClue = '';

const wordList = [
    // Easy Level
    { word: "apple", hint: "A fruit that is commonly eaten." },
    { word: "banana", hint: "A long, yellow fruit with a soft, sweet flesh." },
    { word: "cat", hint: "A small domesticated carnivorous mammal with soft fur." },
    { word: "dog", hint: "A domesticated carnivorous mammal that typically has a long snout, an acute sense of smell, and a barking, howling, or whining voice." },
    { word: "elephant", hint: "A very large animal with thick grey skin, large ears, and a long trunk." },
    { word: "frog", hint: "A tailless amphibian with a short squat body, moist smooth skin, and very long hind legs for leaping." },
    { word: "guitar", hint: "A stringed musical instrument with a fretted fingerboard and typically six strings." },
    { word: "hat", hint: "A shaped covering for the head worn for warmth, as a fashion item, or as part of a uniform." },
    { word: "icecream", hint: "A sweetened frozen food typically eaten as a snack or dessert." },
    { word: "jacket", hint: "A short coat, typically extending to the hips, with sleeves and a fastening down the front." },
  
    // Moderate Level
    { word: "javascript", hint: "A high-level, interpreted programming language that conforms to the ECMAScript specification." },
    { word: "programming", hint: "The process of designing and building an executable computer program to accomplish a specific task." },
    { word: "developer", hint: "A person who writes computer programs or designs software." },
    { word: "algorithm", hint: "A set of rules or a step-by-step procedure for solving a problem or completing a task." },
    { word: "database", hint: "An organized collection of data, typically stored and accessed electronically from a computer system." },
    { word: "function", hint: "A reusable block of code that performs a specific task." },
    { word: "variable", hint: "A storage location identified by a memory address and a symbolic name, used to store data during a program's execution." },
    { word: "loop", hint: "A sequence of instructions that are continually repeated until a certain condition is reached." },
    { word: "object", hint: "A concrete instantiation of any class or object." },
    { word: "array", hint: "An ordered collection of values, each identified by an index or a key." },
  
    // Difficult Level
    { word: "cybersecurity", hint: "Protecting computer systems." },
    { word: "microservices", hint: "A software development approach for small data." },
    { word: "bigdata", hint: "Large and complex sets of data." },
    { word: "machine learning", hint: "Use of algorithms and statistical models." },
    { word: "cyberthreat", hint: "A potential danger or attack to the computer systems." },
    { word: "continuous integration", hint: "The practice of integrating code changes into a central repository frequently." },
    { word: "blockchain", hint: "A decentralized digital ledger" },
    { word: "devops", hint: "A set of practices that combines software development and information technology operations." },
    { word: "quantumcomputing", hint: "Super-powered problem-solving." },
  ];

const resetGame = () => {
    correctLetters = [];
    wrongGuessCount = 0;
    hangarooImage.src = `buhay-${wrongGuessCount}.png`;
    guessText.innerText = `${wrongGuessCount} / ${maxGuess}`;
    keyboardDiv.querySelectorAll("button").forEach((btn) => (btn.disabled = false));
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    gameModal.classList.remove("show");
};

const getRandomWord = () => {
    currentWordIndex = 0;
    getNextWord();
};

const getNextWord = () => {
    if (currentWordIndex < wordList.length) {
        const { word, hint } = wordList[currentWordIndex];
        currentWord = word;
        console.log(word, hint);
        document.querySelector(".hint-text b").innerText = hint;
        resetGame();
    } else {
        gameOver(true);
    }
};

const gameOver = (isVictory) => {
    setTimeout(() => {
        const modalText = isVictory ? "You WIN mahal kita hug ka ni kangaroo!" : "You LOSE pangit mo yari ka kay kangaroo!";
        gameModal.querySelector("img").src = `${isVictory ? 'kiss' : 'patay'}.png`;
        gameModal.querySelector("h4").innerText = isVictory ? 'Congrats!' : 'Game Over!';
        gameModal.querySelector("p").innerHTML = modalText;
        gameModal.classList.add("show");

        if (isVictory) {
            if (currentWordIndex === wordList.length) {
                points += pointsPerWord * wordList.length;
                pointsText.innerText = points;
            }
        } else {
            // If the game is lost, reset points and clues to 0
            points = 0;
            remainingClues = 3;
            pointsText.innerText = points;
            resetClues();
        }
    }, 300);
};

const initGame = (button, clickedLetter) => {
    if (currentWord.includes(clickedLetter)) {
        [...currentWord].forEach((letter, index) => {
            if (letter === clickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } else {
        wrongGuessCount++;
        hangarooImage.src = `buhay-${wrongGuessCount}.png`;
    }

    button.disabled = true;
    guessText.innerText = `${wrongGuessCount} / ${maxGuess}`;

    if (wrongGuessCount === maxGuess) {
        gameOver(false);
    } else if (correctLetters.length === currentWord.length) {
        points += pointsPerWord;
        pointsText.innerText = points;

        currentWordIndex++;
        getNextWord();
    }
};

// Creating keyboard buttons and adding event listeners
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", (e) => initGame(e.target, String.fromCharCode(i)));
}

const resetClues = () => {
    vowelClueButton.disabled = false;
    consonantClueButton.disabled = false;
};

const useVowelClue = () => {
    useClue('vowel');
};

const useConsonantClue = () => {
    useClue('consonant');
};

vowelClueButton.addEventListener("click", useVowelClue);
consonantClueButton.addEventListener("click", useConsonantClue);

const useClue = (clueType) => {
    if (points >= 25 && remainingClues > 0) {
        let randomChar;

        if (clueType === 'vowel') {
            randomChar = getRandomVowel();
            lastVowelClue = randomChar;
        } else if (clueType === 'consonant') {
            randomChar = getRandomConsonant();
            lastConsonantClue = randomChar;
        }

        // Check if the generated clue is in the current word
        if (currentWord.includes(randomChar)) {
            alert(`Clue: The character is "${randomChar}" in the word.`);
        } else {
            // If not, generate a new clue until it matches the current word
            useClue(clueType);
            return;
        }

        points -= 25;
        pointsText.innerText = points;

        remainingClues--;

        if (remainingClues === 0) {
            vowelClueButton.disabled = true;
            consonantClueButton.disabled = true;
        } else {
            if (clueType === 'vowel') {
                vowelClueButton.disabled = false;
            } else if (clueType === 'consonant') {
                consonantClueButton.disabled = false;
            }
        }
    } else {
        alert("You don't have enough points or remaining clues to use this hint.");
    }
};

const getRandomVowel = () => {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    return vowels[Math.floor(Math.random() * vowels.length)];
};

const getRandomConsonant = () => {
    const consonants = [...'bcdfghjklmnpqrstvwxyz'];
    return consonants[Math.floor(Math.random() * consonants.length)];
};

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);
