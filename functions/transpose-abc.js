const {ACCIDENTAL_NUMBER_PREFERENCES, SHARPS_OR_FLATS_PREFERENCES, KEYS} = require('../constants');
const {transposeKey} = require('./transpose-key');
const {transposePitchByKey} = require('./transpose-pitch-by-key');
const {transposePitchChromatically} = require('./tranpose-pitch-chromatically');


//need to ignore clef:perc
//need to support atonal transposition
//thin double barlines should probably not reset the measure's accidentals...

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
    
    const voices = groupVoices(tuneBody);
    const transposedVoices = transposeVoices(voices, originalKey, originalMode, transposedKey, halfSteps, opts);
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
    const newHeadKeyStr = 'K:' + transposedKey[originalMode] + originalMode + getInstructionsFromKeyField(tuneKeyField);
    return tuneHead + newHeadKeyStr + transposedTuneBody;
}

function splitHeadKeyAndBody(abcTune) {
    const headerKeyAndBody = abcTune.split(/(K:.*)/);
    const header = headerKeyAndBody[0];
    const key = headerKeyAndBody[1];
    const body = headerKeyAndBody.slice(2).join('');
    return [header, key, body];
}

function getKeyStrFromField(field) {
    let key = '';
    const keyLetterMatches = field.match(/none|HP|Hp|([A-G][b#]{0,1})/);
    if(keyLetterMatches) {
        key += keyLetterMatches[0];
        if(key != 'none' && key != 'HP' && key !== 'Hp') {
            //first replace 'middle' so as not to confuse the modes into matching with minor
            const middleRegex = /middle/;
            field = field.replace(middleRegex, "");
            //then match with modes
            const modes = /(major|maj|dorian|dor|phrygian|phr|mixolydian|mix|lydian|lyd|minor|min|m|aeolian|aeo|locrian|loc)/i; 
            const modeMatches = field.match(modes);
            if(modeMatches && !modeMatches[0].match(/major|maj/i)) { //ignores major / maj
                key += modeMatches[0];
            }
        }
    }
    return key;
}

function getInstructionsFromKeyField(keyField) {
    const clefRegexStr = "((clef=){0,1}(treble|alto|tenor|bass|perc|none)([+\\-]8){0,1})";
    const middleRegexStr = "(middle=[^\\s\\]]+)";
    const transpositionRegexStr = "(transpose=[+\-]{0,1}\\d+)";
    const octaveRegexStr = "(octave=\\d+)";
    const staffLinesRegexStr = "(stafflines=\\d+)";
    const legalKeyFieldsRegexStr = clefRegexStr + "|" + middleRegexStr + "|" + transpositionRegexStr + "|" + octaveRegexStr + "|" + staffLinesRegexStr;
    const legalKeyFields = new RegExp(legalKeyFieldsRegexStr, 'gi');
    const instructions = keyField.match(legalKeyFields);
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
    const voiceFieldMatches = voiceLine.match(/V:\s*[^\s]+(\s|\])/);
    if(!voiceFieldMatches) return null;
    const voiceField = voiceFieldMatches[0];
    const voiceName = voiceField.split(":")[1].trim();
    return voiceName;
}


function transposeVoices(voices, originalStartingKey, originalMode, transposedStartingKey, halfSteps, opts) {
    const transposedVoices = {};
    //change this to a for in loop. it's nicer to read
    Object.keys(voices).forEach(voiceName => {

        const voiceState = {
            originalKey : originalStartingKey,
            mode : originalMode,
            transposedKey : transposedStartingKey,
            originalAccidentals : undefined,
            transposedAccidentals : undefined
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

    const fieldCommentSymbolNewMeasureOrNote = /(\[[IKLMmNPQRrsTUVWw]:.*\])|([IKLMmNPQRrsTUVWw]:.*)|(%.*\n)|(\![^\s]+\!)|(\|)|(::)|(_*\^*={0,1}[A-Ga-g],*'*)/g;
    
    return voiceLine.replace(fieldCommentSymbolNewMeasureOrNote, str => {
        const commentOrSymbol = /(%.*\n)|(\![^\s]+!)/;
        const field = /(\[[IKLMmNPQRrsTUVWw]:.*\])|([IKLMmNPQRrsTUVWw]:.*)/;
        const newMeasure = /(\|)|(::)/;
        if(str.match(commentOrSymbol) || voiceState.originalKey === 'HP' || voiceState.originalKey === 'Hp') {
            return str;
        } else if(str.match(field)) {
            if(str[0] === 'K' || str[1] === 'K') { 
                return handleKeyChange(str, voiceState, halfSteps, opts);
            } else return str;
        } else if(str.match(newMeasure)) {
            resetAccidentals(voiceState);
            return str;
        }
        else if(voiceState.originalKey === 'none' || voiceState.originalKey === '') {
            return transposePitchChromatically(str, voiceState, halfSteps);
        }
        else
        {
            return transposePitchByKey(str, voiceState, halfSteps);
        }
   });
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

function getKeyObjectAndMode(keyStr) {
    //return the keyStr and undefined for the mode if the key is one of the following:
    //HP or Hp - bagpipe keys. bagpipe music can only be written in a few specific keys, so these will not be transposed.
    //none or an empty string - atonal music. transposeVoices needs to know to transpose these voices chromatically, but the mode is undefined.
    if(keyStr ==='HP' || keyStr === 'Hp' || keyStr === 'none' || keyStr === '') {
        return [keyStr, undefined];
    }
    //first find the key in the table
    let letter = keyStr.replace(/dorian|dor|phrygian|phr|mixolydian|mix|lydian|lyd|minor|min|m|aeolian|aeo|locrian|loc/i, "");
    let mode = 'major';
    if(keyStr.includesIgnoreCase('dor')) {
        mode = 'dorian';
    } else if(keyStr.includesIgnoreCase('phr')) {
        mode = 'phrygian';
    } else if(keyStr.includesIgnoreCase('mix')) {
        mode = 'mixolydian';
    } else if(keyStr.includesIgnoreCase('lyd')) {
        mode = 'lydian';
    } else if(keyStr.includesIgnoreCase('m')) {
        mode = 'minor';
    } else if(keyStr.includesIgnoreCase('aeo')) {
        mode = 'aeolian'
    } else if(keyStr.includesIgnoreCase('loc')) {
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

console.log(transposeABC(`X:1
T:Keys and modes
M:4/4
K:C
T:C/CMAJOR/Cmajor
CDEF GABc |\\
K:CMAJOR
CDEF GABc |\\
K:Cmajor
CDEF GABc |]
T:C maj/ C major/C Major
K:C maj
CDEF GABc |\\
K: C major
CDEF GABc |\\
K:C Major
CDEF GABc |]
T:C Lydian/C Ionian/C Mixolydian
K:C Lydian
CDEF GABc |\\
K:C Ionian
CDEF GABc |\\
K:C Mixolydian
CDEF GABc |]
T:C Dorian/C Minor/Cm
K:C Dorian
CDEF GABc |\\
K:C Minor
CDEF GABc |\\
K:Cm
CDEF GABc |]
T:C Aeolian/C Phrygian/C Locrian
K:C Aeolian
CDEF GABc |\\
K:C Phrygian
CDEF GABc |\\
K:C Locrian
CDEF GABc |]`, 12));