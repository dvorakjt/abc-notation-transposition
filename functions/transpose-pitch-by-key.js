const {DIATONIC_PITCHES, ENHARMONIC_PITCHES} = require('../constants');

module.exports.transposePitchByKey = function (
    originalPitch,
    originalKey,
    transposedKey,
    mode,
    lastOriginalAccidentals,
    lastTransposedAccidentals,
    halfSteps
) {
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
    if(!originalAccidental) originalAccidental = getStoredAccidental(lastOriginalAccidentals, originalPitchLetter); //returns "=", "_", "__", "^", or "^^"
    //if it does, update lastOriginalAccidentals
    else updateStoredAccidentals(lastOriginalAccidentals, originalPitchLetter, originalAccidental); //returns void
    //get the amount the pitch is modified by
    const deviationFromKeySignature = getDeviationFromKeySignature(originalPitchLetter, originalAccidental, originalKey.keySig);
    const [transposedPitch, transposedAccidental, displayAccidental] = applyDeviation(transposedPitchLetter, transposedKey.keySig, deviationFromKeySignature, lastTransposedAccidentals); 
    //calculate octaves
    const octaveModifierCount = countOctaveModifiers(originalPitch, transposedPitch, halfSteps);
    let transposedPitchAtOctave = applyOctaveModifiers(originalPitch, transposedPitch, octaveModifierCount);
    if(displayAccidental) transposedPitchAtOctave = transposedAccidental + transposedPitchAtOctave;
    return transposedPitchAtOctave;
}

//returns a capital letter. throws an error if no letter between a and g found (case insensitive)
function getPitchLetter(pitch) {
    const matches = pitch.match(/[A-G]/i);
    if(!matches) throw new Error("Pitch must contain a letter between a and g (case insensitive).");
    return matches[0].toUpperCase();
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

//returns an accidental if found, otherwise null
function getAccidental(pitch) {
    const matches = pitch.match(/__|_|\^\^|\^|=/);
    if(!matches) return null;
    else return matches[0];
}

//returns the last stored accidental for the supplied pitchLetter. throws an error if the pitchLetter doesn't exist as a property
//of the storedAccidentals object
function getStoredAccidental(storedAccidentals, pitchLetter) {
    const accidental = storedAccidentals[pitchLetter];
    if(!accidental) throw new Error("Could not find pitch letter in stored accidentals object.");
    return accidental;
}

//sets the pitch letter property on the supplied storedAccidentals object to the new accidental. return type is void.
function updateStoredAccidentals(storedAccidentals, pitchLetter, accidental) {
    storedAccidentals[pitchLetter] = accidental;
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

function countOctaveModifiers(originalPitch, transposedPitchLetter, halfSteps) {
    //for each octave of transposition, increment or decrement octaveModifierCount depending on the direction of the modifier
    let octaveModifierCount = 0;
    while(Math.abs(halfSteps) >= 12) {
        if(halfSteps < 0) {
            halfSteps += 12;
            octaveModifierCount--;
        }
        else if(halfSteps > 0) {
            halfSteps -= 12;
            octaveModifierCount++;
        }
    }
    const pitches = ["C", "D", "E", "F", "G", "A", "B"];
    //determine whether any additional modifiers are necessary
    if(halfSteps < 0 && pitches.indexOf(transposedPitchLetter) > pitches.indexOf(getPitchLetter(originalPitch))) {
        octaveModifierCount--;
    } else if(halfSteps > 0 && pitches.indexOf(transposedPitchLetter) < pitches.indexOf(getPitchLetter(originalPitch))) {
        octaveModifierCount++;
    }
    return octaveModifierCount;
}

function applyOctaveModifiers(originalPitch, transposedPitchLetter, octaveModifierCount) {
    const modifiers = {
        commas: originalPitch.includes(",") ? originalPitch.match(/,/g) : [],
        case: isUpperCase(originalPitch[0]) ? "upper" : "lower",
        apostrophes: originalPitch.includes("'") ? originalPitch.match(/'/g) : []
    }

    while(octaveModifierCount !== 0) {
        if(octaveModifierCount < 0) {
            if(modifiers.apostrophes.length) {
                modifiers.apostrophes.pop();
                octaveModifierCount++;
            } else if(modifiers.case === "lower") {
                modifiers.case = "upper"
                octaveModifierCount++;
            } else {
                modifiers.commas.push(",");
                octaveModifierCount++;
            }
        } else {
            if(modifiers.commas.length) {
                modifiers.commas.pop();
                octaveModifierCount--;
            } else if(modifiers.case === "upper") {
                modifiers.case = "lower"
                octaveModifierCount--;
            } else {
                modifiers.apostrophes.push("'");
                octaveModifierCount--;
            }
        }
    }
    if(modifiers.case === "upper") transposedPitchLetter = transposedPitchLetter.toUpperCase();
    else if(modifiers.case === "lower") transposedPitchLetter = transposedPitchLetter.toLowerCase();
    transposedPitchLetter += modifiers.commas.join();
    transposedPitchLetter += modifiers.apostrophes.join();
    return transposedPitchLetter;
}

function isUpperCase(str) {
    return str === str.toUpperCase();
}