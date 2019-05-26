/******************************************************************************
 * Letter Class
 * The Letter object contains a character to be guessed. Until the user guesses
 * the character, a placeholder character is displayed.
 * 
 * NOTE: The object retains the case of the letter in the phrase. It must be
 * converted to lower case to compare against user input!
 ******************************************************************************/

 class Letter {

    constructor(character) {                    // class constructor           
        this._character = character;            // character to guess
        this._charCompare = character.toLowerCase();
        this._guessed = false;                  // indicates letter guessed
    }

    get character() {                           // character property getter
        if (!this._guessed) {                   // character guessed?
            return Letter.placeHolder;          // no - return placeholder
        }
        return this._character;                 // yes - return character
    }

    guess(validation) {                         // method to guess the character
        if (this._charCompare === validation.char) {  // match?
            this._guessed = true;               // yes - turn on guessed
            validation.lettersInWord++;         // increment match count for word
            validation.totalMatches++;          // increment match count for phrase
        }
        return this._guessed;                    // return result of match
    }

    print() {                                   // method to print the character
        console.log(this.toString());
    }

    static get PLACEHOLDER() {                  // static property getter
        return Letter.placeholder;              // returns placeholder
    }
}      

Letter.placeholder = "_";                       // static property placeholder

Letter.prototype.toString = function() {        // override prototype toString()
    if (!this._guessed) {
        return Letter.PLACEHOLDER;
    }
    return this._character;
}

module.exports = Letter;                        // export Letter class
  