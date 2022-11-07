const {ACCIDENTAL_NUMBER_PREFERENCES, SHARPS_OR_FLATS_PREFERENCES, KEYS} = require('../constants');
const {transposeKey} = require('./transpose-key');
const {transposePitchByKey} = require('./transpose-pitch-by-key');

//need to preserve lyrics and other text
//need to ignore clef:perc and key:HP / Hp (bagpipe music) when transposing
//probably cannot just glue each voice together at the end as there may be information that changes throughout the voice (e.x. clef, or even transposition, for instance, switching to clarinet in A)
//^the solution may be to just leave [V:] field + preserve clef and transposition information in key and voice fields
//need to s in place within the voice, and to make sure that values provided after an inline [K:] field are also retained
//need to support atonal transposition
//need to support + signs in tune body
//**information fields may contain spaces after the opening colon!**
//need to support reading abc file DATA (not the file itself) with multiple tunes
//need to support generating (but not actually writing) abc files with transposed tunes
//need to transpose macros

function transposeABC(abcTune, halfSteps, opts = {
    accidentalNumberPreference: ACCIDENTAL_NUMBER_PREFERENCES.PREFER_FEWER,
    preferSharpsOrFlats: SHARPS_OR_FLATS_PREFERENCES.PRESERVE_ORIGINAL
}) {
    const [tuneHead, tuneKeyField, tuneBody] = splitHeadKeyAndBody(abcTune);
    const originalKeyStr = getKeyStrFromField(tuneKeyField);
    const [originalKey, originalMode] = getKeyObjectAndMode(originalKeyStr);
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
    const keyLetterMatches = field.match(/([A-Ga-g]b{0,1}#{0,1})|none/);
    if(keyLetterMatches) {
        key += keyLetterMatches[0];
        if(key != 'none') {
            //first replace 'middle' so as not to confuse the modes into matching with minor
            const middleRegex = /middle/;
            field = field.replace(middleRegex, "");
            //then match with modes
            const modes = /(major|maj|dorian|dor|phrygian|phr|mixolydian|mix|lydian|lyd|minor|min|m|locrian|loc)/i; 
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

/*voices should be grouped into arrays of voice line objects
voices = {
  voiceName: [
    {
      originalLine
      abcNotation
    },
  ]
}
*/

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
    Object.keys(voices).forEach(voiceName => {
        let currentOriginalKey = originalStartingKey;
        let currentMode = originalMode;
        let currentTransposedKey = transposedStartingKey;
        let currentOriginalAccidentals = Object.assign({}, currentOriginalKey.keySig);
        let currentTransposedAccidentals = Object.assign({}, currentTransposedKey.keySig);
        transposedVoices[voiceName] = voices[voiceName].map(voiceLineObj => {
            const voiceLine = voiceLineObj.abcNotation;
            const transposedLine = transposeVoiceLine(voiceLine, currentOriginalKey, currentTransposedKey, currentMode, currentOriginalAccidentals, currentTransposedAccidentals, halfSteps, opts)
            return {
                ...voiceLineObj,
                abcNotation: transposedLine
            }
        });
    });
    return transposedVoices;
}

//probably need current clef too
function transposeVoiceLine(voiceLine, currentOriginalKey, currentTransposedKey, currentMode, currentOriginalAccidentals, currentTransposedAccidentals, halfSteps, opts) {
    //do not attempt to transpose if the voice line is an empty string, if the line is a continuation of a field (starts with +),
    //if the line is a comment or directive (starts with one or more %), or if the line is a field line
    if(!voiceLine.length) return voiceLine;
    if(voiceLine.startsWith("+") || voiceLine.startsWith("%")) return voiceLine;
    const fieldLineRegex = /[IKLMmNPQRrsTUVWw]:/;
    if(voiceLine.substring(0,2).match(fieldLineRegex)) return voiceLine;
    const fieldCommentSymbolNewMeasureOrNote = /(\[\w:.*\])|(%.*\n)|(\![^\s]+\!)|(\|)|(::)|(_*\^*={0,1}[A-Ga-g],*'*)/g;
    return voiceLine.replace(fieldCommentSymbolNewMeasureOrNote, str => {
        const commentOrSymbol = /(%.*\n)|(\![^\s]+!)/;
        const field = /\[\w:.*\]/;
        const newMeasure = /(\|)|(::)/;
        if(str.match(commentOrSymbol)) {
            return str;
        } else if(str.match(field)) {
            if(str[1] === 'K') { // this needs to retain information besides K:
                const keyInstructions = getInstructionsFromKeyField(str);
                const keyStr = getKeyStrFromField(str);
                [currentOriginalKey, currentMode] = getKeyObjectAndMode(keyStr);
                currentOriginalAccidentals = Object.assign({}, currentOriginalKey.keySig);
                currentTransposedKey = transposeKey(keyStr, halfSteps, opts);
                const currentTransposedKeyStr = currentTransposedKey[currentMode] + currentMode;
                currentTransposedAccidentals = Object.assign({}, currentTransposedKey.keySig);
                return str.replace(/\[K:[^\]]+\]/, "[K:" + currentTransposedKeyStr  + keyInstructions + "]");
            } else return str;
        } else if(str.match(newMeasure)) {
            currentOriginalAccidentals = Object.assign({}, currentOriginalKey.keySig);
            currentTransposedAccidentals = Object.assign({}, currentTransposedAccidentals);
            return str;
        } else {
            return transposePitchByKey(str, currentOriginalKey, currentTransposedKey, currentMode, currentOriginalAccidentals, currentTransposedAccidentals, halfSteps);
        }
   });
}

function getKeyObjectAndMode(keyStr) {
    if(!keyStr.length || keyStr === 'none') return keyStr; //preserve the key if there is no key
    //first find the key in the table
    let letter = keyStr.replace(/dorian|dor|phrygian|phr|mixolydian|mix|lydian|lyd|minor|min|m|locrian|loc/i, "");
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
    } else if(keyStr.includesIgnoreCase('loc')) {
        mode = 'locrian';
    }
    const keyObj = KEYS.find(keyPair => {
        return (keyPair.findIndex((key) => {
              return key[mode] === letter;
        }) != -1);
    });
    if(!keyObj) throw new Error('Key not found in KEYS');
    const key = keyObj.find(key => key[mode] === letter);
    if(!key) throw new Error('Key not found in Key Pair');
    return [key, mode];
}


function getVoiceInfo(tuneBody) {
    const voiceInfoLines = tuneBody.match(/V:[^\]\n]+\n/g);
    const voiceInfoObj = {};
    voiceInfoLines.forEach((voiceInfoLine) => {
        const firstSplit = voiceInfoLine.split("V:");
        const secondSplit = firstSplit[1].split(' ');
        const name = secondSplit[0];
        if(!(name in voiceInfoObj)) voiceInfoObj[name] = '';
        voiceInfoObj[name] += secondSplit.slice(1).join(" ");
    });
    return voiceInfoObj
}

console.log(transposeABC(`X:1
K:C clef=treble-8 middle=C transpose=-2 octave=3 stafflines=2
V:T1 name=test subname=test
(B2c2 d2g2) | f6e2 | (d2c2 d2)e2 | d4 c2z2 |
(B2c2 d2g2) | f8 | d3c (d2fe) | H d6 ||
V:T2 
(G2A2 B2e2) | d6c2 | (B2A2 B2)c2 | B4 A2z2 |
z8 | z8 | B3A (B2c2) | H A6 ||
V:B1
!abcdefg! z8 | z2f2 g2a2 | b2z2 z2 e2 | f4 f2z2 |
(d2f2 b2e'2) | d'8 | g3g  g4 | H^f6 || %this is a comment
V:B2 clef=bass test
x8 | x8 | x8 | x8 | [r:this is a remark]
x8 | z2B2 c2d2 | e3e [K:C MIX] (d2c2) | H d6 ||`, 2));