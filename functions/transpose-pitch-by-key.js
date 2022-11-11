const { DIATONIC_PITCHES, ENHARMONIC_PITCHES } = require('../constants');
const { 
    getPitchLetter, 
    getAccidental, 
    getStoredAccidental, 
    updateStoredAccidentals, 
    getTransposedPitchAtOctave
} = require('./transposition-utils');

module.exports.transposePitchByKey = function (
    originalPitch,
    voiceState,
    halfSteps
) {
    const {originalKey, transposedKey, mode} = voiceState;
    //get pitch & key letters
    const originalPitchLetter = getPitchLetter(originalPitch); //returns a capital letter
    const originalKeyLetter = getPitchLetter(originalKey[mode]);
    const transposedKeyLetter = getPitchLetter(transposedKey[mode]);
    //get the scale degree of the pitch
    const originalScaleDegree = getScaleDegreeFromPitchLetter(originalPitchLetter, originalKeyLetter); //returns a number
    //get the the letter in the new key
    const transposedPitchLetter = getPitchLetterFromScaleDegree(originalScaleDegree, transposedKeyLetter); //returns a letter
    //get the note's accidental or null
    let originalAccidental = getAccidental(originalPitch); //returns "", "=", "_", "__", "^", "^^" or null
    //if null, get the lastOriginalAccidental
    if(!originalAccidental) originalAccidental = getStoredAccidental(voiceState.originalAccidentals, originalPitchLetter); //returns "=", "_", "__", "^", or "^^"
    //if it does, update voiceState.originalAccidentals
    else updateStoredAccidentals(voiceState.originalAccidentals, originalPitchLetter, originalAccidental);
    //get the amount the pitch is modified by
    const deviationFromKeySignature = getDeviationFromKeySignature(originalPitchLetter, originalAccidental, originalKey.keySig);
    const [transposedPitch, transposedAccidental, displayAccidental] = applyDeviation(transposedPitchLetter, transposedKey.keySig, deviationFromKeySignature, voiceState.transposedAccidentals); 
    //calculate octaves
    let transposedPitchAtOctave = getTransposedPitchAtOctave(originalPitch, transposedPitch, halfSteps);
    if(displayAccidental) transposedPitchAtOctave = transposedAccidental + transposedPitchAtOctave;
    return transposedPitchAtOctave;
}

//returns a scale degree (a number). throws an error if the key or pitch letters passed in aren't A-G (case sensitive).
function getScaleDegreeFromPitchLetter(pitchLetter, keyLetter) {
    if(!pitchLetter.match(/[A-G]/) || !keyLetter.match(/[A-G]/)) {
        throw new Error("pitchLetter and keyLetter must be capital letters between A and G");
    }
    const scale = [];
    const rootIndex = DIATONIC_PITCHES.findIndex(pitch => pitch === keyLetter);
    const octaveIndex = rootIndex + 7;
    for(let i = rootIndex; i < octaveIndex; i++) {
        scale.push(DIATONIC_PITCHES.get(i));
    }
    return scale.indexOf(pitchLetter);
}

//returns a letter from A-G. throws an error if the scale degree is not a number between 0 and 6 or the keyLetter is not 
//a letter between A-G
function getPitchLetterFromScaleDegree(scaleDegree, keyLetter) {
    if(Number.isNaN(scaleDegree) || scaleDegree < 0 || scaleDegree > 6) {
        throw new Error("scaleDegree should be a number between 0 and 6 (inclusive)");
    }
    if(!keyLetter.match(/[A-G]/)) throw new Error("keyLetter must be a capital letter between A and G");
    const scale = [];
    const rootIndex = DIATONIC_PITCHES.findIndex(pitch => pitch === keyLetter);
    const octaveIndex = rootIndex + 7;
    for(let i = rootIndex; i < octaveIndex; i++) {
        scale.push(DIATONIC_PITCHES.get(i));
    }
    return scale[scaleDegree];
}

//gets the number of half steps that the pitch+accidental deviates from its pitch level in the key signature
//throws an error if the pitch letter is not A-G, the accidental is not __, _, ^^, ^ or =, or the keySignature doesn't 
//have the note as a property
function getDeviationFromKeySignature(pitchLetter, accidental, keySignature) {
    if(!pitchLetter.match(/[A-G]/)) throw new Error("pitchLetter must be a capital letter between A and G");
    if(!accidental.match(/__|_|\^\^|\^|=/)) throw new Error("Invalid accidental.");
    const keySignatureAccidental = keySignature[pitchLetter];
    if(!keySignatureAccidental) throw new Error("Could not find pitchLetter in the supplied key signature object.");
    switch(keySignatureAccidental) {
        case "=" :
            switch(accidental) {
                case "__" :
                    return -2;
                case "_" :
                    return -1;
                case "=" :
                    return 0;
                case "^" :
                    return 1;
                case "^^" :
                    return 2;
            }
        case "_" :
            switch(accidental) {
                case "__" :
                    return -1;
                case "_" :
                    return 0;
                case "=" :
                    return 1;
                case "^" :
                    return 2;
                case "^^" :
                    return 3;
            }
        case "^" :
            switch(accidental) {
                case "__" :
                    return -3;
                case "_" :
                    return -2;
                case "=" :
                    return -1;
                case "^" :
                    return 0;
                case "^^" :
                    return 1;
            }
    }
}

//returns an array containing the transposedPitch, the transposedAccidental, displayAccidental (a boolean value)
function applyDeviation(pitchLetter, keySignature, deviationFromKeySignature, storedAccidentals) {
    const keySignatureAccidental = keySignature[pitchLetter];
    let pitch = pitchLetter;
    let accidental;
    if(deviationFromKeySignature === 0) accidental = keySignatureAccidental;
    else if(deviationFromKeySignature === 1) {
        if(keySignatureAccidental === "_") accidental = "=";
        else if(keySignatureAccidental === "=") accidental = "^";
        else accidental = "^^";
    } else if(deviationFromKeySignature === -1) {
        if(keySignatureAccidental === "_") accidental = "__";
        else if(keySignatureAccidental === "=") accidental = "_";
        else accidental = "=";
    } else if(deviationFromKeySignature === 2) {
        if(keySignatureAccidental === "_") accidental = "^";
        else if(keySignatureAccidental === "=") accidental = "^^";
        else return transposePitchChromatically(pitchLetter, keySignatureAccidental, deviationFromKeySignature, storedAccidentals);
    } else if(deviationFromKeySignature === -2) {
        if(keySignatureAccidental === "_") return transposePitchChromatically(pitchLetter, keySignatureAccidental, deviationFromKeySignature, storedAccidentals);
        else if(keySignatureAccidental === "=") accidental = "__";
        else accidental = "_";
    } else return transposePitchChromatically(pitchLetter, keySignatureAccidental, deviationFromKeySignature, storedAccidentals);
    //determine whether to display the accidental
    let displayAccidental;
    if(storedAccidentals[pitch] === accidental) displayAccidental = false;
    else {
        storedAccidentals[pitch] = accidental;
        displayAccidental = true;
    }
    return [pitch, accidental, displayAccidental];
}

function transposePitchChromatically(pitchLetter, keySignatureAccidental, deviationFromKeySignature, storedAccidentals) {
    const originalPitch = keySignatureAccidental + pitchLetter;
    const pitchGroupIndex = ENHARMONIC_PITCHES.findIndex((pitchGroup) => {
        return pitchGroup.includes(originalPitch);
    });
    const transposedPitchGroup = ENHARMONIC_PITCHES.get(pitchGroupIndex + deviationFromKeySignature);
    let transposedPitchLetter;
    let transposedAccidental;
    let displayAccidental;
    for(let pitchLetter in storedAccidentals) {
        const storedAccidental = storedAccidentals[pitchLetter];
        const storedPitch = storedAccidental + pitchLetter;
        if(transposedPitchGroup.includes(storedPitch)) {
            transposedPitchLetter = pitchLetter;
            transposedAccidental = storedAccidental;
            displayAccidental = false;
            break;
        }
    }
    if(!transposedPitchLetter) {
        //if the pitch group contains a natural note, prefer that. otherwise, prefer a flat if the note was transposed down or
        //a sharp if it was transposed up
        let transposedPitch = transposedPitchGroup.find(pitch => pitch.match(/=/));
        if(!transposedPitch) {
            if(deviationFromKeySignature < 0) transposedPitch = transposedPitchGroup.find(pitch => pitch.match(/^_[A-G]$/));
            else transposedPitch = transposedPitchGroup.find(pitch => pitch.match(/^\^[A-G]$/))
        }
        transposedPitchLetter = getPitchLetter(transposedPitch);
        transposedAccidental = getAccidental(transposedPitch);
        storedAccidentals[transposedPitchLetter] = transposedAccidental;
        displayAccidental = true;
    }
    return [transposedPitchLetter, transposedAccidental, displayAccidental];
}

module.exports.getScaleDegreeFromPitchLetter = getScaleDegreeFromPitchLetter;
module.exports.getPitchLetterFromScaleDegree = getPitchLetterFromScaleDegree;