"use strict"
const {ACCIDENTALS, ACCIDENTAL_NUMBER_PREFERENCES, SHARPS_OR_FLATS_PREFERENCES}= require("./constants/constants");
const { KEYS } = require("./constants/key-signatures");

function transposeABC(abcTune, steps, opts = {
    accidentalNumberPreference: ACCIDENTAL_NUMBER_PREFERENCES.PREFER_FEWER,
    preferSharpsOrFlats: SHARPS_OR_FLATS_PREFERENCES.PRESERVE_ORIGINAL
}) {
    const [tuneHead, tuneBody] = splitHeadAndBody(abcTune);
    const voices = groupVoices(tuneBody);
    const transposedVoices = transposeVoices("C", voices);
    const voiceInfo = getVoiceInfo(tuneBody);
    let transposedABC = '';
    Object.keys(transposedVoices).forEach(voiceName => {
        transposedABC += "V:" + voiceName;
        if(voiceName in voiceInfo) transposedABC += ' ' + voiceInfo[voiceName];
        transposedABC += '\n'; 
        transposedABC += transposedVoices[voiceName];
    });
    return tuneHead + transposedABC;
}

function splitHeadAndBody(abcTune) {
    return ['X:!\n', abcTune];
}



function transposeVoices(startingKey, voices) {
    const transposedVoices = {};
    Object.keys(voices).forEach(voiceName => {
       let key = startingKey;
       const fieldCommentSymbolOrNote = /(\[\w:.*\])|(%.*\n)|(\![^\s]+\!)|(_*\^*={0,1}[A-Ga-g],*'*)/g;
       transposedVoices[voiceName] = voices[voiceName].replace(fieldCommentSymbolOrNote, str => {
            const commentOrSymbol = /(%.*\n)|(\![^\s]+!)/;
            const field = /\[\w:.*\]/;
            if(str.match(commentOrSymbol)) {
                return str;
            } else if(str.match(field)) {
                if(str[1] === 'K') {
                    key = getKeyFromField(str);
                    console.log(key);
                    return str.replace(/\[K:[^\]]+\]/, "[K:" + transposeKey(key)) + "]";
                } else return str;
            } else {
                return transposeNote(str);
            }
       });
    });
    return transposedVoices;
}

function getKeyFromField(field) {
    let key = '';
    const keyLetterMatches = field.substring(3).match(/([A-Ga-g]b{0,1}#{0,1})|none/);
    if(keyLetterMatches.length) {
        key += keyLetterMatches[0];
        if(key != 'none') {
            const modes = /(dorian|dor|phrygian|phr|mixolydian|mix|lydian|lyd|minor|min|m|locrian|loc)(\s|\])/i; //ignores major / maj
            const modeMatches = field.substring(3).match(modes);
            if(modeMatches) key += modeMatches[0];
        }
    }
    return key;
}


function transposeNote(note, startingKey, steps) {
    //if the starting key is none, transpose each note chromatically by half steps
    //otherwise, transpose each note by scale degree
    return "x";
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

function getVoiceInfo(tuneBody) {
    const voiceInfoLines = tuneBody.match(/V:[^\]\n]+\n/);
    const voiceInfoObj = {};
    voiceInfoLines.forEach((voiceInfoLine) => {
        const firstSplit = voiceInfoLine.split("V:");
        const secondSplit = firstSplit[1].split(/\s/);
        const name = secondSplit[0];
        if(!(name in voiceInfoObj)) voiceInfoObj[name] = '';
        voiceInfoObj[name] += secondSplit.slice(1).join(" ");
    });
    return voiceInfoObj
}

console.log(transposeABC(`V:T1 name=test subname=test
(B2c2 d2g2) | f6e2 | (d2c2 d2)e2 | d4 c2z2 |
(B2c2 d2g2) | f8 | d3c (d2fe) | H d6 ||
V:T2 
(G2A2 B2e2) | d6c2 | (B2A2 B2)c2 | B4 A2z2 |
z8 | z8 | B3A (B2c2) | H A6 ||
V:B1
!abcdefg! z8 | z2f2 g2a2 | b2z2 z2 e2 | f4 f2z2 |
(d2f2 b2e'2) | d'8 | g3g  g4 | H^f6 ||
V:B2
x8 | x8 | x8 | x8 | [r:this is a remark]
x8 | z2B2 c2d2 | e3e [K:C MIX] (d2c2) | H d6 ||`), 2);