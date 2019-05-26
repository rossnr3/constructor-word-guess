/******************************************************************************
 * Word Class
 * The Word object represents a current word the user is attempting to
 * guess. The word is stored as an array of Letter objects.
 ******************************************************************************/

 const Letter = require("./letter.js");          // require Letter class

class Word {

    constructor(wordToGuess) {                  // class constructor           
        this.guessed = false;                   // turn off guessed
        this.letters = [];                      // array of Letter objects
        for (let i=0; i < wordToGuess.length; i++) {
            this.letters.push(new Letter(wordToGuess.charAt(i)));
        }
    }

    guess(validation) {                         // method to guess a letter of word
        validation.lettersInWord = 0;           // zero letters matched in word
        this.letters.forEach( (letter) => {     // loop thru letters
            if (letter._guessed) {              // letter previously guessed?
                validation.lettersInWord++;     // yes - count previous matches
            } else {                            // no
                letter.guess(validation);       // see if letter matches
            }
        });
        if (validation.lettersInWord === this.letters.length) { // word guessed?
            this.guessed = true;                // yes - turn on guessed
            validation.wordsComplete++;         // increment words guessed
        }
    }

    print() {                                   // method to print the word
        console.log(this.toString());
    }

}   

Word.prototype.toString = function() {          // override prototype toString()
    let wordStr = "";
    this.letters.forEach((letter) => wordStr += letter + " ");
    return wordStr;
}
  
module.exports = Word;                          // export Word class
