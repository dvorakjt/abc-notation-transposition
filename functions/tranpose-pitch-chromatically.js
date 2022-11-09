const { ENHARMONIC_PITCHES } = require('../constants');
const { getPitchLetter, getAccidental, getStoredAccidental, updateStoredAccidentals, getTransposedPitchAtOctave } = require('./transposition-utils');

module.exports.transposePitchChromatically = function (originalPitch, voiceState, halfSteps) {
    const originalPitchLetter = getPitchLetter(originalPitch);
    let originalAccidental = getAccidental(originalPitch);
    if(!originalAccidental) originalAccidental = getStoredAccidental(voiceState.originalAccidentals, originalPitchLetter);
    else updateStoredAccidentals(voiceState.originalAccidentals, originalPitchLetter, originalAccidental);
    const originalPitchWithAccidental = originalAccidental + originalPitchLetter;
    const pitchGroupIndex = ENHARMONIC_PITCHES.findIndex((pitchGroup) => {
        return pitchGroup.includes(originalPitchWithAccidental);
    });
    const transposedPitchGroup = ENHARMONIC_PITCHES.get(pitchGroupIndex + halfSteps);
    let transposedPitchLetter;
    let transposedAccidental;
    let displayAccidental;
    //if the pitch group contains a natural note, prefer that. otherwise, prefer a flat if the note was transposed down or
    //a sharp if it was transposed up
    let transposedPitch = transposedPitchGroup.find(pitch => pitch.match(/=/));
    if(!transposedPitch) {
        if(originalAccidental.includes('_') || (originalAccidental === '=' && halfSteps < 0)) transposedPitch = transposedPitchGroup.find(pitch => pitch.match(/^_[A-G]$/));
        else transposedPitch = transposedPitchGroup.find(pitch => pitch.match(/^\^[A-G]$/));
    }
    transposedPitchLetter = getPitchLetter(transposedPitch);
    transposedAccidental = getAccidental(transposedPitch);
    const storedAccidental = getStoredAccidental(voiceState.transposedAccidentals, transposedPitchLetter);
    if(storedAccidental !== transposedAccidental) {
        updateStoredAccidentals(voiceState.transposedAccidentals, transposedPitchLetter, transposedAccidental);
        displayAccidental = true;
    } else displayAccidental = false;
    let transposedPitchAtOctave = getTransposedPitchAtOctave(originalPitch, transposedPitchLetter, halfSteps);
    if(displayAccidental) transposedPitchAtOctave = transposedAccidental + transposedPitchAtOctave;
    return transposedPitchAtOctave;
}