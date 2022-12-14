const {isUpperCase} = require('./string-utils');

//returns a capital letter. throws an error if no letter between a and g found (case insensitive)
function getPitchLetter (pitch) {
    const matches = pitch.match(/[A-G]/i);
    if(!matches) throw new Error(`Pitch ${pitch} must contain a letter between a and g (case insensitive).`);
    return matches[0].toUpperCase();
}

//returns an accidental if found, otherwise null
function getAccidental (pitch) {
    const matches = pitch.match(/__|_|\^\^|\^|=/);
    if(!matches) return null;
    else return matches[0];
}

//returns the last stored accidental for the supplied pitchLetter. throws an error if the pitchLetter doesn't exist as a property
//of the storedAccidentals object
function getStoredAccidental (storedAccidentals, pitchLetter) {
    const accidental = storedAccidentals[pitchLetter];
    if(!accidental) throw new Error(`Could not find pitch letter ${pitchLetter} in stored accidentals object.`);
    return accidental;
}

//sets the pitch letter property on the supplied storedAccidentals object to the new accidental. return type is void.
function updateStoredAccidentals (storedAccidentals, pitchLetter, accidental) {
    storedAccidentals[pitchLetter] = accidental;
}

function getTransposedPitchAtOctave (originalPitch, transposedPitchLetter, halfSteps) {
    const octaveModifierCount = countOctaveModifiers(originalPitch, transposedPitchLetter, halfSteps);
    return applyOctaveModifiers(originalPitch, transposedPitchLetter, octaveModifierCount);
}

function countOctaveModifiers (originalPitch, transposedPitchLetter, halfSteps) {
    //for each octave of transposition, increment or decrement octaveModifierCount depending on the direction of the modifier
    let octaveModifierCount = 0;
    while(Math.abs(halfSteps) >= 12) {
        if(halfSteps < 0) {
            halfSteps += 12;
            octaveModifierCount--;
        }
        else {
            halfSteps -= 12;
            octaveModifierCount++;
        }
    }
    const pitches = ["C", "D", "E", "F", "G", "A", "B"];
    //determine whether any additional modifiers are necessary
    const originalPitchLetter = getPitchLetter(originalPitch);
    if(halfSteps < 0 && pitches.indexOf(transposedPitchLetter) > pitches.indexOf(originalPitchLetter)) {
        octaveModifierCount--;
    } else if(halfSteps > 0 && pitches.indexOf(transposedPitchLetter) < pitches.indexOf(originalPitchLetter)) {
        octaveModifierCount++;
    } else if(halfSteps === 0) {
        if(originalPitchLetter === 'C' && transposedPitchLetter === 'B') octaveModifierCount--;
        else if(originalPitchLetter === 'B' && transposedPitchLetter === 'C') octaveModifierCount++;
    }
    return octaveModifierCount;
}

function applyOctaveModifiers (originalPitch, transposedPitchLetter, octaveModifierCount) {
    const originalPitchLetter = originalPitch.match(/[A-Ga-g]/)[0];

    const modifiers = {
        commas: originalPitch.includes(",") ? originalPitch.match(/,/g) : [],
        case: isUpperCase(originalPitchLetter) ? "upper" : "lower",
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
    else transposedPitchLetter = transposedPitchLetter.toLowerCase();
    transposedPitchLetter += modifiers.commas.join('');
    transposedPitchLetter += modifiers.apostrophes.join('');
    return transposedPitchLetter;
}

module.exports.getPitchLetter = getPitchLetter;
module.exports.getAccidental = getAccidental;
module.exports.getStoredAccidental = getStoredAccidental;
module.exports.updateStoredAccidentals = updateStoredAccidentals;
module.exports.getTransposedPitchAtOctave = getTransposedPitchAtOctave;
module.exports.countOctaveModifiers = countOctaveModifiers;
module.exports.applyOctaveModifiers = applyOctaveModifiers;
