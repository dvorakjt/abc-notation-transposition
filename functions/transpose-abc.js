const {ACCIDENTAL_NUMBER_PREFERENCES, SHARPS_OR_FLATS_PREFERENCES, KEYS, REGULAR_EXPRESSIONS} = require('../constants');
const {transposeKey} = require('./transpose-key');
const {transposePitchByKey} = require('./transpose-pitch-by-key');
const {transposePitchChromatically} = require('./tranpose-pitch-chromatically');
const {includesIgnoreCase} = require('./string-utils');

const transposeABC = function (abcTune, halfSteps, opts = {
    accidentalNumberPreference: ACCIDENTAL_NUMBER_PREFERENCES.PREFER_FEWER,
    preferSharpsOrFlats: SHARPS_OR_FLATS_PREFERENCES.PRESERVE_ORIGINAL
}) {
    const [tuneHead, tuneKeyField, tuneBody] = splitHeadKeyAndBody(abcTune);
    const originalKeyStr = getKeyStrFromField(tuneKeyField);

    //originalkey returns the original keyStr and undefined if the key is HP, Hp, none or ''
    const [originalKey, originalMode] = getKeyObjectAndMode(originalKeyStr);
    //returns the key if the original key is HP, Hp, none or ''
    const transposedKey = transposeKey(originalKeyStr, halfSteps, opts);
    
    //voice descriptions may be in header
    //clef can be described either in the key or in the voice fields
    
    const defaultClef = getClef(tuneKeyField) || 'treble';
    const voicesNamesAndClefs = getVoiceNamesAndClefs(tuneHead);

    //this will take in a voices object. each voice can have a starting clef
    const voices = groupVoices(tuneBody);

    const transposedVoices = transposeVoices(voices, originalKey, originalMode, transposedKey, voicesNamesAndClefs, defaultClef, halfSteps, opts);
    let sortedVoices = [];
    for(let voiceName in transposedVoices) {
        const voice = transposedVoices[voiceName];
        for(let voiceLineObj of voice) {
            sortedVoices.push(voiceLineObj);
        }
    }
    sortedVoices.sort((a,b) => {
        return a.originalLine - b.originalLine
    });
    sortedVoices = sortedVoices.map(voiceLineObj => {
        return voiceLineObj.abcNotation;
    });
    const transposedTuneBody = sortedVoices.join('\n');
    let newHeadKeyStr = 'K:';
    if(typeof transposedKey === 'string') {
        newHeadKeyStr += transposedKey;
    } else {
        newHeadKeyStr += transposedKey[originalMode] + originalMode;
    }
    newHeadKeyStr += getInstructionsFromKeyField(tuneKeyField);
    return tuneHead + newHeadKeyStr + transposedTuneBody;
}

function splitHeadKeyAndBody(abcTune) {
    const headerKeyAndBody = abcTune.split(REGULAR_EXPRESSIONS.KEY_FIELD);
    const header = headerKeyAndBody[0];
    const key = headerKeyAndBody[1];
    const body = headerKeyAndBody.slice(2).join('');
    return [header, key, body];
}

function getKeyStrFromField(field) {
    let key = '';
    const keyLetterMatches = field.match(REGULAR_EXPRESSIONS.KEY_SIGNATURES);
    if(keyLetterMatches) {
        key += keyLetterMatches[0];
        if(key != 'none' && key != 'HP' && key !== 'Hp') {
            //first replace 'middle' so as not to confuse the modes into matching with minor
            field = field.replace(REGULAR_EXPRESSIONS.MIDDLE, "");
            //then match with modes
            const modeMatches = field.match(REGULAR_EXPRESSIONS.MODES);
            if(modeMatches && !modeMatches[0].match(REGULAR_EXPRESSIONS.MAJOR_MODE)) { //ignores major / maj
                key += modeMatches[0];
            }
        }
    }
    return key;
}

function getKeyObjectAndMode(keyStr) {
    //return the keyStr and undefined for the mode if the key is one of the following:
    //HP or Hp - bagpipe keys. bagpipe music can only be written in a few specific keys, so these will not be transposed.
    //none or an empty string - atonal music. transposeVoices needs to know to transpose these voices chromatically, but the mode is undefined.
    if(keyStr ==='HP' || keyStr === 'Hp' || keyStr === 'none' || keyStr === '') {
        return [keyStr, undefined];
    }
    //first find the key in the table
    let letter = keyStr.replace(REGULAR_EXPRESSIONS.MODES, "");
    let mode = 'major';
    if(includesIgnoreCase(keyStr,'dor')) {
        mode = 'dorian';
    } else if(includesIgnoreCase(keyStr, 'phr')) {
        mode = 'phrygian';
    } else if(includesIgnoreCase(keyStr, 'mix')) {
        mode = 'mixolydian';
    } else if(includesIgnoreCase(keyStr, 'lyd')) {
        mode = 'lydian';
    } else if(includesIgnoreCase(keyStr, 'm')) {
        mode = 'minor';
    } else if(includesIgnoreCase(keyStr, 'aeo')) {
        mode = 'aeolian'
    } else if(includesIgnoreCase(keyStr, 'loc')) {
        mode = 'locrian';
    }
    const keyObj = KEYS.find(keyPair => {
        return (keyPair.findIndex((key) => {
              return key[mode] === letter;
        }) != -1);
    });
    if(!keyObj) throw new Error(`Key ${keyStr} not found in KEYS`);
    const key = keyObj.find(key => key[mode] === letter);
    if(!key) throw new Error('Key not found in Key Pair');
    return [key, mode];
}

function getClef(field) {
    const clefMatches = field.match(REGULAR_EXPRESSIONS.CLEFS);
    if(!clefMatches) return null;
    else {
        const clef = clefMatches[0].replace('clef=', '').trim();
        return clef;
    }
}

function getVoiceNamesAndClefs(tuneHead) {
    const voiceFieldMatches = tuneHead.match(REGULAR_EXPRESSIONS.VOICE_FIELD);
    if(!voiceFieldMatches) return {};
    else {
        const voiceObjects = {};
        voiceFieldMatches.forEach((voiceField) => {
            const voiceNameMatches = voiceField.match(REGULAR_EXPRESSIONS.VOICE_NAME);
            const clef = getClef(voiceField);
            if(voiceNameMatches && clef) {
                const voiceName = voiceFieldMatches[0];
                voiceObjects[voiceName] = clef;
            }
        });
    }
}

function getInstructionsFromKeyField(keyField) {
    const instructions = keyField.match(REGULAR_EXPRESSIONS.KEY_FIELD_INSTRUCTIONS);
    if(!instructions) return '';
    else return ' ' + instructions.join(' ');
}

function groupVoices(tuneBody) {
    let voices = {};
    const tuneLines = tuneBody.split('\n');
    let currentVoiceName = '';
    for(let i = 0; i < tuneLines.length; i++) {
        const currentLine = tuneLines[i];
        const newVoiceName = getVoiceName(currentLine);
        if(newVoiceName) currentVoiceName = newVoiceName;
        if(!voices[currentVoiceName]) voices[currentVoiceName] = [];
        voices[currentVoiceName].push({
            originalLine: i,
            abcNotation: currentLine
        });
    }
    return voices;
}

function getVoiceName(voiceLine) {
    const voiceFieldMatches = voiceLine.match(REGULAR_EXPRESSIONS.VOICE_NAME);
    if(!voiceFieldMatches) return null;
    const voiceField = voiceFieldMatches[0];
    const voiceName = voiceField.split(":")[1].trim();
    return voiceName;
}


function transposeVoices(voices, originalStartingKey, originalMode, transposedStartingKey, voiceNamesAndClefs, defaultClef, halfSteps, opts) {
    const transposedVoices = {};
    //change this to a for in loop. it's nicer to read
    Object.keys(voices).forEach(voiceName => {

        const voiceState = {
            originalKey : originalStartingKey,
            mode : originalMode,
            transposedKey : transposedStartingKey,
            originalAccidentals : undefined,
            transposedAccidentals : undefined,
            clef : voiceNamesAndClefs[voiceName] || defaultClef
        }

        resetAccidentals(voiceState);

        transposedVoices[voiceName] = voices[voiceName].map(voiceLineObj => {
            const voiceLine = voiceLineObj.abcNotation;
            const transposedLine = transposeVoiceLine(voiceLine, voiceState, halfSteps, opts)
            return {
                ...voiceLineObj,
                abcNotation: transposedLine
            }
        });
    });
    return transposedVoices;
}

function resetAccidentals(voiceState) {

    if(voiceState.originalKey === 'none' || voiceState.originalKey === '' || voiceState.originalKey === 'HP' || voiceState.originalKey === 'Hp') {
        voiceState.originalAccidentals = {A: "=", B: "=", C: "=", D: "=", E: "=", F:"=", G:"="};
        voiceState.transposedAccidentals = {A: "=", B: "=", C: "=", D: "=", E: "=", F:"=", G:"="};
    } 
    else {
        voiceState.originalAccidentals = Object.assign({}, voiceState.originalKey.keySig);
        voiceState.transposedAccidentals = Object.assign({}, voiceState.transposedKey.keySig);
    }
}

//probably need current clef too
function transposeVoiceLine(voiceLine, voiceState, halfSteps, opts) {
    //do not attempt to transpose if the voice line is an empty string, if the line is a continuation of a field (starts with +),
    //if the line is a comment or directive (starts with one or more %), or if the line is a field line
    if(!voiceLine.length) return voiceLine;
    if(voiceLine.startsWith("+") || voiceLine.startsWith("%")) return voiceLine;
    
    return voiceLine.replace(REGULAR_EXPRESSIONS.FIELD_COMMENT_SYMBOL_NEW_MEASURE_OR_NOTE, str => {
        if(str.match(REGULAR_EXPRESSIONS.COMMENT_OR_SYMBOL)) {
            return str;
        } else if(str.match(REGULAR_EXPRESSIONS.FIELD)) {
            if(str[0] === 'V' || str[1] === 'V') {
                checkForNewClefAndUpdateState(str, voiceState);
                return str;
            } else if(str[0] === 'K' || str[1] === 'K') {
                checkForNewClefAndUpdateState(str, voiceState);
                return handleKeyChange(str, voiceState, halfSteps, opts);
            } else return str;
        } else if(str.match(REGULAR_EXPRESSIONS.NEW_MEASURE)) {
            resetAccidentals(voiceState);
            return str;
        } else if(voiceState.originalKey === 'HP' || voiceState.originalKey === 'Hp' || voiceState.clef === 'perc') {
            return str;
        } else if(voiceState.originalKey === 'none' || voiceState.originalKey === '') {
            return transposePitchChromatically(str, voiceState, halfSteps);
        } else {
            return transposePitchByKey(str, voiceState, halfSteps);
        }
   });
}

function checkForNewClefAndUpdateState(str, voiceState) {
    const clef = getClef(str);
    if(clef) {
        voiceState.clef = clef;
    }
}

function handleKeyChange(str, voiceState, halfSteps, opts) {
    const keyInstructions = getInstructionsFromKeyField(str);
    const keyStr = getKeyStrFromField(str);
    [voiceState.originalKey, voiceState.mode] = getKeyObjectAndMode(keyStr);
    voiceState.transposedKey = transposeKey(keyStr, halfSteps, opts);
    resetAccidentals(voiceState);

    let currentTransposedKeyStr;
    if(typeof voiceState.transposedKey === 'string') currentTransposedKeyStr = voiceState.transposedKey;
    else currentTransposedKeyStr = voiceState.transposedKey[voiceState.mode] + voiceState.mode;

    let newKeyField = "K:" + currentTransposedKeyStr  + keyInstructions;
    if(str[0] === '[') newKeyField = '[' + newKeyField + ']';
    return newKeyField;
}

module.exports.transposeABC = transposeABC;