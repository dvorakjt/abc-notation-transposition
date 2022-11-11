const {transposePitchChromatically} = require('../../../../functions/transpose-pitch-by-key');
const {KEYS} = require('../../../../constants');


test('Expect transposePitchChromatically to correctly transpose various pitches.', () => {
    const pitchLetter = 'F';
    const keySignatureAccidental = '^';
    const deviation = -3;
    const storedAccidentals = {
        A: "=",
        B: "=",
        C: "=",
        D: "=",
        E: "=",
        F: "^",
        G: "="
    }
    expect(transposePitchChromatically(pitchLetter, keySignatureAccidental, deviation, storedAccidentals)).toEqual(['E', '_', true]);
});

test('Expect transposePitchChromatically to correctly transpose various pitches.', () => {
    const pitchLetter = 'G';
    const keySignatureAccidental = '=';
    const deviation = 3;
    const storedAccidentals = {
        A: "=",
        B: "=",
        C: "=",
        D: "=",
        E: "=",
        F: "^",
        G: "="
    }
    expect(transposePitchChromatically(pitchLetter, keySignatureAccidental, deviation, storedAccidentals)).toEqual(['A', '^', true]);
});