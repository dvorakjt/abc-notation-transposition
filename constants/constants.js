const DIRECTIONS = {
    UP: 1,
    DOWN: -1
}

module.exports.ACCIDENTALS = {
    NONE: 0,
    FLATS: 1,
    SHARPS: 2
}

module.exports.ACCIDENTAL_NUMBER_PREFERENCES = {
    PREFER_FEWER : 0,
    NO_PREFERENCE: 1, //instead go with sharps or flats preference
    PREFER_MORE: 2
}

//if both options are the same in terms of number of flats or sharps, or no preference is selected, this will be used to evaluate key choice
module.exports.SHARPS_OR_FLATS_PREFERENCES = {
    PRESERVE_ORIGINAL: 0, //preserve original prefers to keep it a sharp key if the original is a sharp key, but if this is not possible, will prefer flat keys
    PREFER_FLATS: 1, //the reasoning behind prefering flat keys is that for minor scales, the raised tones will become natural pitches instead of potential double sharps
    PREFER_SHARPS: 2
}


