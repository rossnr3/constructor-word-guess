/******************************************************************************
 * This script contains the 'Word Guess' game.
 * A random phrase is selected, and the user attempts to guess letters of the
 * words contained in the phrase.
 ******************************************************************************/


const Word = require("./word.js");              // Require Word class
const inquirer = require("inquirer");           // Require inquirer module
const phrases = require("./phrases.js");        // Require getPhrase function

const displayWidth = 80;                        // Constants for displays
const gameName = "WORD GUESS";
const gameTitle = `WELCOME TO ${gameName}`;
const titlePad = Math.floor((displayWidth - gameTitle.length)/2);

const inst = [                                  // game instructions array
"\nInstructions:\n",
"WORD GUESS is exactly what it sounds like, a word guessing game.",
"\nA random phrase or idiom is selected, which the user must guess. The",
"phrase will contain 2 or more words, and a hint will be displayed to",
"assist.",
"\nAn initial screen of words with blank letter positions is displayed.",
"Using the word patterns of blank positions, and the hint, the user",
"attempts to guess the words in the phrase by entering letters to 'fill",
"in the blanks'.",
"\nEach phrase will have an indicated number of guesses which is randomly",
"generated for each round of the game. The round ends when the user has",
"correctly guessed the word, or when the number of guesses allowed has been",
"consumed.",
"\nIf the user guesses the phrase within the guesses allotted their correct",
"score is incremented. Otherwise the incorrect score is incremented. At the",
"end of each round, the user will be given the opportunity to play another",
"round, or exit the game.",
"\nThe game ends when the user decides to exit the game, or all phrases",
"have been used.\n"
];

// Variables controlling the game
let phrasesGuessed = 0;                         // Scores
let phrasesMissed = 0;
let guessesRemaining = 0;                       // remaining guesses
const guessFactor = 1.4;                        // used to calculate guesses
let words = [];                                 // contains words to guess
let currentPhrase = "";                         // current phrase to guess
let hint = "";                                  // contains phrase hint
let ltrsGuessed = [];                           // track letters guessed
const charA_Z = "az";                           // tracking variables
const uniCodeA = charA_Z.charCodeAt(0);
const uniCodeZ = charA_Z.charCodeAt(charA_Z.length - 1);
ltrsGuessed.length = uniCodeZ - uniCodeA + 1;

function Validation(char) {                     // Validation obj constructor
    this.char = char;                           // character to validate
    this.totalMatches = 0;                      // letter matches in phrase
    this.wordsComplete = 0;                     // words completed
    this.lettersInWord = 0;                     // letters matched within word
}

/******************************************************************************
 * Helper Functions
 ******************************************************************************/

// Display a separator to the console
function displaySeparator(char="-", spaces=1) {
    console.log(`${"\n".repeat(spaces)}${char.repeat(displayWidth)}`);
}

// Display the score
function displayScore() {
    console.log(
    `Phrases Guessed: ${phrasesGuessed}     Phrases Missed: ${phrasesMissed}`);
}

// Display game welcome
function displayHeader() {
    displaySeparator("*", 2);
    console.log(`\n${" ".repeat(titlePad)}${gameTitle}\n`);
    displaySeparator("*");
}

// Display instructions
// NOTE: Asynchronous function will wait on console input
async function displayInstructions() {
    try {
        inst.forEach((inst_line) => console.log(inst_line));
        return await inquirer.prompt([{
            name: "value", message: "Press ENTER to continue: >"
        }]);
    } catch (err) {
        console.log("Error:", err);
    }
}

// Display Starting New Game
function displayStartGame() {
    displaySeparator(undefined, 3);
    console.log(`\nStarting a new ${gameName}:\n`);
    displayScore();
}

// Display Game Over
function displayGameOver(msg="") {
    displaySeparator(undefined, 3);
    console.log(`\nGAME OVER: ${msg}`);
    displayScore();
}

/******************************************************************************
 * Game Functions
 ******************************************************************************/

// Display on each user turn to guess a letter
function displayUserTurn() {
    displaySeparator(undefined, 2);
    console.log(`\nGuesses Remaining: ${guessesRemaining}`);
    console.log(`Hint: ${hint}`);
    let phrase = "";
    words.forEach( word => phrase += "  " + word.toString());
    console.log(`\nPhrase: ${phrase}\n`);
}

// Extract the words from the phrase to be guessed and create an array
// of Word objects.
function setUpGame(selection) {
    hint = selection.meaning;                   // save the hint
    currentPhrase = selection.phrase;           // ...and phrase
    words = selection.phrase.split(" ");        // extract words from phrase
    for (let i = 0; i < words.length; i++) {    // ...& create array
        words[i] = new Word(words[i]);          // ...of Word objects
    }
    ltrsGuessed.fill(false);                    // init tracking array
    let totalLetters = 0;                       // Calculate guesses
    words.forEach( word => totalLetters += word.letters.length);
    guessesRemaining = Math.floor(totalLetters * guessFactor); 
}

// Obtain a letter from the user
// NOTE: Asynchronous function will wait on console input
async function getUserGuess() {
    try {
        let input = "";
        let inputAccepted = false;
        do {
            let result = await inquirer.prompt([{
                name: "userGuess",
                message: "Enter a letter guess: >"
            }]);
            input = result.userGuess;
            if (input.length > 1) {
                console.log("Only enter a single letter. Try again.\n");
                continue;
            }
            let inputCharCode = input.toLowerCase().charCodeAt(0);
            if (input.length === 0 
                || inputCharCode < uniCodeA 
                || inputCharCode > uniCodeZ) {
                console.log("You must only enter letters. Try again.\n");
                continue;
            }
            if (ltrsGuessed[inputCharCode]) {
                console.log("You've already guessed that letter. Try again.\n");
                continue;
            }
            ltrsGuessed[inputCharCode] = true;
            inputAccepted = true;
        }
        while (!inputAccepted);
        return input;
    } catch (err) {
        console.log("Error:", err);
    }
}

// Determine if user wants to play again
// NOTE: Asynchronous function will wait on console input
async function playAgain() {
    try {
        let result = await inquirer.prompt([{
            type: "confirm",
            name: "userResp",
            message: "Play again? >"
        }]);
        return result.userResp;
    } catch (err) {
        console.log("Error:", err);
    }

}

// Validate the user's guess
function validateLetter(userGuess) {
    let validateObj = new Validation(userGuess); // create Validation object
    words.forEach( word => {                    // Loop thru word objects
        if (word.guessed) {                     // word already guessed?
            validateObj.wordsComplete++;        // yes - count prior matches
        } else {                                // no
            word.guess(validateObj);            // check for matching letters
        }
    });
    return validateObj;                         // return validation object
}

// Display round results
function displayResults(validateObj) {
    guessesRemaining--;                         // decrement guesses left
    if (validateObj.totalMatches == 0) {        // letter not in phrase
        console.log(
            `\nSORRY...'${validateObj.char}' is a miss.`);
            return false;
    }
    if (validateObj.wordsComplete === words.length) { // phrase guessed
        phrasesGuessed++;
        displaySeparator(undefined, 3);
        console.log("\nCONGRATULATIONS...you guessed the phrase!\n");
        console.log(`"${currentPhrase}"\n`);
        displayScore();
        return true;
    }
    if (guessesRemaining <= 0) {                // ran out of guesses
        phrasesMissed++;
        displaySeparator(undefined, 3);
        console.log("\nSORRY...no more guesses!\n");
        displayScore();
        return true;
    }
}

/******************************************************************************
 * Game Logic
 ******************************************************************************/

// Game Round Loop to guess the phrase
// Require the user to enter letters to guess the phrase, validate the
// letters, and determine whether an end of game condition occurs
async function roundLoop() {
    let roundComplete = false;                  // controls do loop
    do {                                        // loop to obtain user guesses
        displayUserTurn();                      // display current status
        let userGuess = await getUserGuess();   // get a letter from the user
        let validateObj = validateLetter(userGuess); // validate the letter
        roundComplete = displayResults(validateObj);
    } while (!roundComplete);
}
    
// Primary Game Loop
// Select a phrase to guess, initialize the game, and start the guessing
// round for the phrase.
async function gameLoop() {
    let gameComplete = false;
    do {
        let selection = phrases.getPhrase();
        if (!selection) {
            displayGameOver("All phrases selected.")
            process.exit(0);
        } else {
            setUpGame(selection);
            displayStartGame();
            await roundLoop();
            gameComplete = (!await playAgain());
        }
    } while (!gameComplete);
}

// Play the game
// NOTE: Asynchronous function will wait for displayInstructions completion
// Display the instructions, when the user presses ENTER, start the game
async function playGame() {
    displayHeader();
    await displayInstructions();
    gameLoop();
}

/******************************************************************************
 * Main Process
 ******************************************************************************/
playGame();                                         // Play the game
