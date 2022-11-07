const {KEYS, ACCIDENTALS, ACCIDENTAL_NUMBER_PREFERENCES, SHARPS_OR_FLATS_PREFERENCES} = require('../constants');

//replace this with a utility function, which should be imported from functions/utils
Object.defineProperty(String.prototype, 'includesIgnoreCase', {
    value: function(substr) {
      return this.toUpperCase().includes(substr.toUpperCase());
    },
    enumerable: false
});

//expects a capital letter as per the ABC standard
module.exports.transposeKey = function (key, halfSteps, opts) {
    //return the key if key is HP, Hp, none or an empty string
    if(key === 'HP' || key === 'Hp' || key === 'none' || key === '') return key;
    //first find the key in the table
    let letter = key.replace(/dorian|dor|phrygian|phr|mixolydian|mix|lydian|lyd|minor|min|m|aeolian|aeo|locrian|loc/i, "").trim();
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
    } else if(key.includesIgnoreCase('aeo')) {
        mode = 'aeolian';
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
    const transposedKeyPair = KEYS.get(currentKeyPairIndex + halfSteps);
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