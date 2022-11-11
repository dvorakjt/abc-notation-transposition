const {
    KEYS, 
    ACCIDENTALS, 
    ACCIDENTAL_NUMBER_PREFERENCES, 
    SHARPS_OR_FLATS_PREFERENCES, 
    REGULAR_EXPRESSIONS,
} = require('../constants');
const {includesIgnoreCase} = require('./string-utils');

//expects a capital letter as per the ABC standard
module.exports.transposeKey = function (key, halfSteps, opts) {
    //return the key if key is HP, Hp, none or an empty string
    if(key === 'HP' || key === 'Hp' || key === 'none' || key === '') return key;
    //first find the key in the table
    let letter = key.replace(REGULAR_EXPRESSIONS.MODES, "").trim();
    let mode = 'major';
    if(includesIgnoreCase(key, 'dor')) {
        mode = 'dorian';
    } else if(includesIgnoreCase(key, 'phr')) {
        mode = 'phrygian';
    } else if(includesIgnoreCase(key, 'mix')) {
        mode = 'mixolydian';
    } else if(includesIgnoreCase(key, 'lyd')) {
        mode = 'lydian';
    } else if(includesIgnoreCase(key, 'm')) {
        mode = 'minor';
    } else if(includesIgnoreCase(key, 'aeo')) {
        mode = 'aeolian';
    } else if(includesIgnoreCase(key, 'loc')) {
        mode = 'locrian';
    }
    const currentKeyPairIndex = KEYS.findIndex((keyPair) => {
        return (keyPair.findIndex((key) => {
              return key[mode] === letter;
        }) != -1);
    });
    const currentKeyObj = KEYS.get(currentKeyPairIndex).find((key) => {
        return key[mode] === letter;
    });
    const transposedKeyPair = KEYS.get(currentKeyPairIndex + halfSteps);
    let transposedKeyObj;
    
    if(transposedKeyPair.length === 1) {
        transposedKeyObj = transposedKeyPair[0];
    } 
    
    else if(opts.accidentalNumberPreference === ACCIDENTAL_NUMBER_PREFERENCES.PREFER_FEWER) {
        if(transposedKeyPair[0].numOfAccidentals < transposedKeyPair[1].numOfAccidentals) {
            transposedKeyObj = transposedKeyPair[0];
        }
        else if(transposedKeyPair[0].numOfAccidentals > transposedKeyPair[1].numOfAccidentals) {
            transposedKeyObj = transposedKeyPair[1];
        }
        else if(opts.preferSharpsOrFlats === SHARPS_OR_FLATS_PREFERENCES.PREFER_SHARPS || 
            (opts.preferSharpsOrFlats === SHARPS_OR_FLATS_PREFERENCES.PRESERVE_ORIGINAL && currentKeyObj.contains === ACCIDENTALS.SHARPS)) 
        {
            transposedKeyObj = transposedKeyPair[0]; //the first key in the key pair will always contain sharps, the second, flats
        } 
        else {
            transposedKeyObj = transposedKeyPair[1];
        }
    } 
    
    else if(opts.accidentalNumberPreference === ACCIDENTAL_NUMBER_PREFERENCES.NO_PREFERENCE) {
        if(opts.preferSharpsOrFlats === SHARPS_OR_FLATS_PREFERENCES.PREFER_SHARPS || 
            (opts.preferSharpsOrFlats === SHARPS_OR_FLATS_PREFERENCES.PRESERVE_ORIGINAL && currentKeyObj.contains === ACCIDENTALS.SHARPS)) 
        {
            if(transposedKeyPair[0].contains === ACCIDENTALS.SHARPS) {
                transposedKeyObj = transposedKeyPair[0];
            } else transposedKeyObj = transposedKeyPair[1];
        } 
        else {
            if(transposedKeyPair[0].contains === ACCIDENTALS.FLATS) {
                transposedKeyObj = transposedKeyPair[0];
            } else transposedKeyObj = transposedKeyPair[1];
        }
    } else {
        if(transposedKeyPair[0].numOfAccidentals > transposedKeyPair[1].numOfAccidentals) {
            transposedKeyObj = transposedKeyPair[0];
        }
        else if(transposedKeyPair[0].numOfAccidentals < transposedKeyPair[1].numOfAccidentals) {
            transposedKeyObj = transposedKeyPair[1];
        }
        else if(opts.preferSharpsOrFlats === SHARPS_OR_FLATS_PREFERENCES.PREFER_SHARPS || 
            (opts.preferSharpsOrFlats === SHARPS_OR_FLATS_PREFERENCES.PRESERVE_ORIGINAL && currentKeyObj.contains === ACCIDENTALS.SHARPS)) 
        {
            if(transposedKeyPair[0].contains === ACCIDENTALS.SHARPS) {
                transposedKeyObj = transposedKeyPair[0];
            } else transposedKeyObj = transposedKeyPair[1];
        } 
        else {
            if(transposedKeyPair[0].contains === ACCIDENTALS.FLATS) {
                transposedKeyObj = transposedKeyPair[0];
            } else transposedKeyObj = transposedKeyPair[1];
        }
    }
    return transposedKeyObj;
}