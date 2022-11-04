const {KEYS} = require("../constants");
const {ACCIDENTALS, ACCIDENTAL_NUMBER_PREFERENCES, SHARPS_OR_FLATS_PREFERENCES} = require("../constants/constants");

Object.defineProperty(String.prototype, 'includesIgnoreCase', {
    value: function(substr) {
      return this.toUpperCase().includes(substr.toUpperCase());
    },
    enumerable: false
});

module.exports.transposeKey = function (key, steps, opts) {
    if(!key.length || key === 'none') return key; //preserve the key if there is no key
    //first find the key in the table
    let letter = key.replace(/dorian|dor|phrygian|phr|mixolydian|mix|lydian|lyd|minor|min|m|locrian|loc/i, "");
    let mode = 'major';
    if(key.includesIgnoreCase('dor')) {
        mode = 'dorian';
    } else if(key.includesIgnoreCase('phr')) {
        mode = 'phrygian';
    } else if(key.includesIgnoreCase('mix')) {
        mode = 'mixolydian';
    } else if(key.includesIgnoreCase('lyd')) {
        mode = 'lydian';
    } else if(key.includesIgnoreCase('m')) {
        mode = 'minor';
    } else if(key.includesIgnoreCase('loc')) {
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
    const transposedKeyPair = KEYS.get(currentKeyPairIndex + steps);
    let transposedKeyObj;
    if(transposedKeyPair.length === 1) {
        transposedKeyObj = transposedKeyPair[0];
    } else if(opts.accidentalNumberPreference === ACCIDENTAL_NUMBER_PREFERENCES.PREFER_FEWER) {
        if(transposedKeyPair[0].numOfAccidentals < transposedKeyPair[1].numOfAccidentals) {
            transposedKeyObj = transposedKeyPair[0];
        }
        else if(transposedKeyPair[0].numOfAccidentals > transposedKeyPair[1].numOfAccidentals) {
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
    } else if(opts.accidentalNumberPreference === ACCIDENTAL_NUMBER_PREFERENCES.NO_PREFERENCE) {
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