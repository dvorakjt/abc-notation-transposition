const {SimpleCircularArray} = require('../classes/SimpleCircularArray');
const {KEYS} = require("../constants");

Object.defineProperty(String.prototype, 'isUpperCase', {
    value: function() {
      return this.toString() === this.toUpperCase();
    },
    enumerable: false
});

function transposePitchByKey (oldKey, newKey, mode, halfSteps, pitch) { //how to handle multiple octaves?
    //get the scale degree
    const oldKeyLetter = getPitchLetter(oldKey[mode]);
    console.log(oldKeyLetter);
    const pitchLetter = getPitchLetter(pitch);
    console.log(pitchLetter);
    const scaleDegree = getScaleDegreeFromPitch(oldKeyLetter, pitchLetter);
    console.log(scaleDegree);
    //get the new pitch letter
    const newKeyLetter = getPitchLetter(newKey[mode]);
    console.log(newKeyLetter);
    const newPitchLetter = getPitchFromScaleDegree(newKeyLetter, scaleDegree);
    console.log(newPitchLetter);
    //determine the octave
    const newPitch = determineOctave(pitch, newPitchLetter, halfSteps);
    //finally modify the accidental, because this may require that the actual note is modified (e.x. if there is a double sharp/flat in the original)
    const modifier = getPitchModifier(oldKey.keySig, pitch);
    return modifyAccidental(newKey.keySig, newPitch, modifier);
}

function getPitchLetter(pitch) {
    return pitch.match(/[A-G]/i)[0].toUpperCase();
}

function getScaleDegreeFromPitch(keyLetter, pitchLetter) {
    const alphabet = new SimpleCircularArray(["A", "B", "C", "D", "E", "F", "G"]);
    const thisScale = [];
    for(let i = alphabet.findIndex(k => k === keyLetter); i < alphabet.findIndex(k => k === keyLetter) + 7; i++) {
        thisScale.push(alphabet.get(i));
    }
    return thisScale.indexOf(pitchLetter.toUpperCase());
}

function getPitchFromScaleDegree(keyLetter, scaleDegree) {
    const alphabet = new SimpleCircularArray(["A", "B", "C", "D", "E", "F", "G"]);
    const thisScale = [];
    for(let i = alphabet.findIndex(k => k === keyLetter); i < alphabet.findIndex(k => k === keyLetter) + 7; i++) {
        thisScale.push(alphabet.get(i));
    }
    return thisScale[scaleDegree];
}

//takes in the old pitch, minus the accidental
function determineOctave(oldPitch, newPitchLetter, halfSteps) {
    //for each octave of transposition, increment or decrement octaveModifiers depending on the direction of the modifier
    let octaveModifiers = 0;
    while(Math.abs(halfSteps) >= 12) {
        console.log("THIS WILL NEVER RUN");
        if(halfSteps < 0) {
            halfSteps += 12;
            octaveModifiers--;
        }
        else if(halfSteps > 0) {
            halfSteps -= 12;
            octaveModifiers++;
        }
    }
    const pitches = ["C", "D", "E", "F", "G", "A", "B"];
    //determine whether any additional modifiers are necessary
    if(halfSteps < 0 && pitches.indexOf(newPitchLetter) > pitches.indexOf(getPitchLetter(oldPitch))) {
        octaveModifiers--;
    } else if(halfSteps > 0 && pitches.indexOf(newPitchLetter) < pitches.indexOf(getPitchLetter(oldPitch))) {
        octaveModifiers++;
    }
    console.log(octaveModifiers);
    return applyOctaveModifiers(oldPitch, newPitchLetter, octaveModifiers);
}

function applyOctaveModifiers(oldPitch, newPitch, octaveModifiers) {
    console.log(oldPitch[0].isUpperCase());
    const modifiers = {
        commas: oldPitch.includes(",") ? oldPitch.match(/,/g) : [],
        case: oldPitch[0].isUpperCase() ? "upper" : "lower",
        apostrophes: oldPitch.includes("'") ? oldPitch.match(/'/g) : []
    }

    while(octaveModifiers !== 0) {
        if(octaveModifiers < 0) {
            if(modifiers.apostrophes.length) {
                modifiers.apostrophes.pop();
                octaveModifiers++;
            } else if(modifiers.case === "lower") {
                modifiers.case = "upper"
                octaveModifiers++;
            } else {
                modifiers.commas.push(",");
                octaveModifiers++;
            }
        } else {
            if(modifiers.commas.length) {
                modifiers.commas.pop();
                octaveModifiers--;
            } else if(modifiers.case === "upper") {
                modifiers.case = "lower"
                octaveModifiers--;
            } else {
                modifiers.apostrophes.push("'");
                octaveModifiers--;
            }
        }
    }
    if(modifiers.case === "upper") newPitch = newPitch.toUpperCase();
    else if(modifiers.case === "lower") newPitch = newPitch.toLowerCase();
    newPitch += modifiers.commas.join();
    newPitch += modifiers.apostrophes.join();
    return newPitch;
}

function getPitchModifier(keySignature, pitch) {
    let noteModifier = pitch.match(/__|_|\^\^|\^|=/);
    if(!noteModifier) return {
        halfSteps: 0,
        display: false
    }
    noteModifier = noteModifier[0];
    const letter = pitch.match(/[A-G]/i)[0].toUpperCase();
    const keySignatureModifier = keySignature[letter];
    if(noteModifier === keySignatureModifier) return {
        halfSteps: 0,
        display: true
    }
    else if(keySignatureModifier === '') {
        switch(noteModifier) {
            case '=' :
                return {
                    halfSteps: 0,
                    display: true
                }
            case '_' :
                return {
                    halfSteps: -1,
                    display: true
                }
            case '__' :
                return {
                    halfSteps: -2,
                    display: true
                }
            case '^' :
                return {
                    halfSteps: 1,
                    display: true
                }
            case '^^' : 
                return {
                    halfSteps: 2,
                    display: true
                }
        }
    } else if(keySignatureModifier === '_') {
        switch(noteModifier) {
            case '=' :
                return {
                    halfSteps: 1,
                    display: true
                }
            case '_' :
                return {
                    halfSteps: 0,
                    display: true
                }
            case '__' :
                return {
                    halfSteps: -1,
                    display: true
                }
            case '^' :
                return {
                    halfSteps: 2,
                    display: true
                }
            case '^^' : 
                return {
                    halfSteps: 3,
                    display: true
                }
        } 
    } else if(keySignatureModifier === '^') {
        switch(noteModifier) {
            case '=' :
                return {
                    halfSteps: -1,
                    display: true
                }
            case '_' :
                return {
                    halfSteps: -2,
                    display: true
                }
            case '__' :
                return {
                    halfSteps: -3,
                    display: true
                }
            case '^' :
                return {
                    halfSteps: 0,
                    display: true
                }
            case '^^' : 
                return {
                    halfSteps: 1,
                    display: true
                }
        }
    }
}

function modifyAccidental(keySignature, pitch, modifier) {
    if(!modifier.display) return pitch;
    const pitchLetter = getPitchLetter(pitch);
    const keySignatureModifier = keySignature[pitchLetter];
    if(keySignatureModifier === '') {
        if(modifier.halfSteps === 0) return '=' + pitch;
        else if(modifier.halfSteps === -1) return '_' + pitch;
        else if(modifier.halfSteps === -2) return '__' + pitch;
        else if(modifier.halfSteps === -3) return handleMinorThird()
        else if(modifier.halfSteps === 1) return '^' + pitch;
        else if(modifier.halfSteps === 2) return '^^' + pitch;
        else if(modifier.halfSteps === 3) return handleMinorThird();
    } else if(keySignatureModifier === '_') {
        if(modifier.halfSteps === 0) return '_' + pitch;
        else if(modifier.halfSteps === -1) return '__' + pitch;
        else if(modifier.halfSteps === -2) return handleMinorThird();
        else if(modifier.halfSteps === -3) return handleMajorThird();
        else if(modifier.halfSteps === 1) return '=' + pitch;
        else if(modifier.halfSteps === 2) return "^" + pitch;
        else if(modifier.halfSteps === 3) return '^^' + pitch;
    } else if(keySignatureModifier === '^') {
        if(modifier.halfSteps === 0) return '^' + pitch;
        else if(modifier.halfSteps === -1) return '=' + pitch;
        else if(modifier.halfSteps === -2) return '_' + pitch;
        else if(modifier.halfSteps === -3) return '__' + pitch;
        else if(modifier.halfSteps === 1) return '__' + pitch;
        else if(modifier.halfSteps === 2) return handleMinorThird();
        else if(modifier.halfSteps === 3) return handleMajorThird();
    }
}


function handleMinorThird() {
    return "fix this later";
}

function handleMajorThird() {
    return "fix this later";
}

const CMAJOR = KEYS.get(0)[0];
const DMAJOR = KEYS.get(2)[0];

console.log(transposePitchByKey(CMAJOR, DMAJOR, "major", 14, "E"));