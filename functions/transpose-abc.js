const {ACCIDENTAL_NUMBER_PREFERENCES, SHARPS_OR_FLATS_PREFERENCES, KEYS} = require('../constants');
const {transposeKey} = require('./transpose-key');
const {transposePitchByKey} = require('./transpose-pitch-by-key');

//need to transpose key in header but keep other information (ex clef)
//need to preserve lyrics and other text
//need to ignore clef:perc and key:HP / Hp (bagpipe music) when transposing
//probably cannot just glue each voice together at the end as there may be information that changes throughout the voice (e.x. clef, or even transposition, for instance, switching to clarinet in A)
//^the solution may be to just leave [V:] fieldpreserve clef and transposition information in key and voice fields
//need to s in place within the voice, and to make sure that values provided after an inline [K:] field are also retained
//need to support atonal transposition
//need to support + signs in tune body

//need to support reading abc file DATA (not the file itself) with multiple tunes
//need to support generating (but not actually writing) abc files with transposed tunes
//need to transpose macros

function transposeABC(abcTune, halfSteps, opts = {
    accidentalNumberPreference: ACCIDENTAL_NUMBER_PREFERENCES.PREFER_FEWER,
    preferSharpsOrFlats: SHARPS_OR_FLATS_PREFERENCES.PRESERVE_ORIGINAL
}) {
    const [tuneHead, tuneKeyField, tuneBody] = splitHeadKeyAndBody(abcTune); //replace this with new method
    const originalKey = getKeyFromField(tuneKeyField);
    const originalKeyInstructions = getInstructionsFromKeyField(tuneKeyField);
    const transposedKey = transposeKey(originalKey, halfSteps, opts); //this is cool, but don't forget that keys in the head must be transposed too
    console.log(transposedKey);
    const voices = groupVoices(tuneBody);
    const transposedVoices = transposeVoices(voices, originalKey, transposedKey, halfSteps, opts);
    const voiceInfo = getVoiceInfo(tuneBody);
    let transposedABC = '';
    Object.keys(transposedVoices).forEach(voiceName => {
        transposedABC += 'V:' + voiceName;
        if(voiceName in voiceInfo) transposedABC += ' ' + voiceInfo[voiceName];
        transposedABC += '\n'; 
        transposedABC += transposedVoices[voiceName];
    });
    return tuneHead + '\n' + transposedABC;
}

function splitHeadKeyAndBody(abcTune) {
    const headerKeyAndBody = abcTune.split(/(K:.*)/);
    const header = headerKeyAndBody[0];
    const key = headerKeyAndBody[1];
    const body = headerKeyAndBody.slice(2).join('');
    return [header, key, body];
}

function getKeyFromField(field) {
    let key = '';
    const keyLetterMatches = field.match(/([A-Ga-g]b{0,1}#{0,1})|none/);
    if(keyLetterMatches) {
        key += keyLetterMatches[0];
        if(key != 'none') {
            const modes = /(major|maj|dorian|dor|phrygian|phr|mixolydian|mix|lydian|lyd|minor|min|m|locrian|loc)/i; 
            const modeMatches = field.match(modes);
            if(modeMatches && !modeMatches[0].match(/major|maj/i)) { //ignores major / maj
                key += modeMatches[0];
            }
        }
    }
    return key;
}

//PICK UP HERE
function getInstructionsFromKeyField(keyField) {
    const legalKeyFields = /((clef=){0,1}(treble|alto|tenor|bass|perc|none)([+\-]8){0,1}|(middle=[^\s]+)|(transpose=[+\-]{0,1}\d+)|(octave=))/g
    return keyField.match()
}

function groupVoices(tuneBody) {
    const voiceNames = getVoiceNames(tuneBody);
    const voiceTuneBodies = getVoiceTuneBodies(tuneBody);
    const voices = {};
    voiceNames.forEach(voiceName => {
        if(!voices[voiceName]) voices[voiceName] = '';
    });
    for(let i = 0; i < voiceTuneBodies.length; i++) {
        voices[voiceNames[i]] += voiceTuneBodies[i];
    }
    return voices;
}

function getVoiceNames(tuneBody) {
    const voiceNameLines = tuneBody.match(/(V:[^\]\n]+\n)|(\[V:.+\])/g);
    const voiceNames = voiceNameLines.map((voiceNameStr) => {
        const firstSplit = voiceNameStr.split("V:");
        const secondSplit = firstSplit[1].split(/[\s\]]/);
        return secondSplit[0];
    });
    return voiceNames;
}

function getVoiceTuneBodies(tuneBody) {
    if(tuneBody.startsWith("V:") || tuneBody.startsWith("[V:")) {
        const firstDelimiterRemoved = tuneBody.replace(/(V:[^\]\n]+\n)|(\[V:.+\])/, "");
        return firstDelimiterRemoved.split(/(?:V:[^\]\n]+\n)|(?:\[V:.+\])/);
    } else return tuneBody.split(/(?:V:[^\]\n]+\n)|(?:\[V:.+\])/);
}


function transposeVoices(voices, originalStartingKeyStr, transposedStartingKey, halfSteps, opts) {
    const transposedVoices = {};
    Object.keys(voices).forEach(voiceName => {
       let [currentOriginalKey, currentMode] = getKeyObjectAndMode(originalStartingKeyStr);
       let currentTransposedKey = transposedStartingKey;
       let currentOriginalAccidentals = Object.assign({}, currentOriginalKey.keySig);
       let currentTransposedAccidentals = Object.assign({}, currentTransposedKey.keySig);
       const fieldCommentSymbolNewMeasureOrNote = /(\[\w:.*\])|(%.*\n)|(\![^\s]+\!)|(\|)|(_*\^*={0,1}[A-Ga-g],*'*)/g;
       transposedVoices[voiceName] = voices[voiceName].replace(fieldCommentSymbolNewMeasureOrNote, str => {
            const commentOrSymbol = /(%.*\n)|(\![^\s]+!)/;
            const field = /\[\w:.*\]/;
            const newMeasure = /\|/;
            if(str.match(commentOrSymbol)) {
                return str;
            } else if(str.match(field)) {
                if(str[1] === 'K') {
                    const keyStr = getKeyFromField(str);
                    console.log(keyStr);
                    [currentOriginalKey, currentMode] = getKeyObjectAndMode(keyStr);
                    currentOriginalAccidentals = Object.assign({}, currentOriginalKey.keySig);
                    console.log("line 103");
                    console.log(currentOriginalAccidentals);
                    currentTransposedKey = transposeKey(keyStr, halfSteps, opts);
                    const currentTransposedKeyStr = currentTransposedKey[currentMode] + currentMode;
                    currentTransposedAccidentals = Object.assign({}, currentTransposedKey.keySig);
                    return str.replace(/\[K:[^\]]+\]/, "[K:" + currentTransposedKeyStr  + "]");
                } else return str;
            } else if(str.match(newMeasure)) {
                currentOriginalAccidentals = Object.assign({}, currentOriginalKey.keySig);
                currentTransposedAccidentals = Object.assign({}, currentTransposedAccidentals);
                return str;
            } else {
                return transposePitchByKey(str, currentOriginalKey, currentTransposedKey, currentMode, currentOriginalAccidentals, currentTransposedAccidentals, halfSteps);
            }
       });
    });
    return transposedVoices;
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
        console.log(secondSplit);
        const name = secondSplit[0];
        if(!(name in voiceInfoObj)) voiceInfoObj[name] = '';
        voiceInfoObj[name] += secondSplit.slice(1).join(" ");
    });
    return voiceInfoObj
}

console.log(splitHeadKeyAndBody(`X:1
K:C
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
x8 | z2B2 c2d2 | e3e [K:C MIX] (d2c2) | H d6 ||`));