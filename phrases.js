/******************************************************************************
 * This script contains phrases and their meanings which are selected
 * randomly. An API would be more appropriate, but one wasn't found that
 * provided both a phrase and a meaning.
 ******************************************************************************/

// Array of phrases and their meanings 
const phraseArray = [
    {phrase: "Quick and Dirty", 
    meaning: "Things that are fixed with great speed, but as a result, it's probably not going to work very well."},
    {phrase: "Put a Sock In It", 
    meaning: "Asking someone to be quiet or to shut up."},
    {phrase: "Swinging For the Fences", 
    meaning: "Giving something your all."},
    {phrase: "Raining Cats and Dogs", 
    meaning: "When it is raining heavily."},
    {phrase: "Elvis Has Left The Building", 
    meaning: "Something that is all over."},
    {phrase: "Burst Your Bubble", 
    meaning: "To ruin someone's happy moment."},
    {phrase: "Jumping the Gun", 
    meaning: "Something that occurs too early before preparations are ready. Starting too soon."},
    {phrase: "Heads Up", 
    meaning: "Used as an advanced warning. To become keenly aware."},
    {phrase: "Ring Any Bells", 
    meaning: "Recalling a memory; causing a person to remember something or someone."},
    {phrase: "My Cup of Tea", 
    meaning: "Someone or something that one finds to be agreeable or delightful."},
    {phrase: "Everything But The Kitchen Sink", 
    meaning: "Including nearly everything possible."},
    {phrase: "Under the Weather", 
    meaning: "Not feeling well, in health or mood."},
    {phrase: "Quality Time", 
    meaning: "Spending time with another to strengthen the relationship."},
    {phrase: "Playing For Keeps", 
    meaning: "Said when things are about to get serious."},
    {phrase: "Poke Fun At", 
    meaning: "Making fun of something or someone; ridicule."},
    {phrase: "Cry Over Spilt Milk", 
    meaning: "It's useless to worry about things that already happened and cannot be changed."},
    {phrase: "Wild Goose Chase", 
    meaning: "Futilely pursuing something that will never be attainable."},
    {phrase: "Every Cloud Has a Silver Lining", 
    meaning: "To be optimistic, even in difficullt times."},
    {phrase: "In a Pickle", 
    meaning: "Being in a difficult predicament; a mess; an undesirable situation."},
    {phrase: "Go For Broke", 
    meaning: "To risk it all, even if it means losing everything. To go all out."},
]

const selectedPhrases = [];                     // Parallel array tracks selected 
const maxAttempts = 3;                          // Maximum random attempts

// Select a phrase randomly to a limit. If unsuccessful, select the next unused
// phrase.
function getIndex() {
    let index = 0;
    for (let i = 0; i < maxAttempts; i++) {     // Random selection
        index = Math.floor(Math.random() * phraseArray.length);
        if (!selectedPhrases[index]) {
            selectedPhrases[index] = true;
            return index; 
        }
    }
    // Unsuccessful, try sequential selection
    for (let index = 0; index < phraseArray.length; index++) {
        if (!selectedPhrases[index]) {
            selectedPhrases[index] = true;
            return index;
        }
    }
    return null;                                // All phrases used
}

// NOTE: Exported function.
// Return a random phrase and its meaning.
// Attempt to randomly select the phrase, and if unsuccessful return the next
// unused phrase. If all phrases have been used, return null.
exports.getPhrase = function() {
    let index = getIndex();
    if (index) {
        return {
            phrase: phraseArray[index].phrase,
            meaning: phraseArray[index].meaning
        };
    }
    return index;
}

// Module initialization
selectedPhrases.length = phraseArray.length;
selectedPhrases.fill(false);

