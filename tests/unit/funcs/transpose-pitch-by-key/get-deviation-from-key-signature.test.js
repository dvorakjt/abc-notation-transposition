const {getDeviationFromKeySignature} = require('../../../../functions/transpose-pitch-by-key');
const {KEYS} = require('../../../../constants');

//pitchLetter, accidental, keySignature

test('Expect getDeviationFromKeySignature to return a number of halfsteps between -3 and 3', () => {

    const CMAJOR = KEYS.get(0)[0];
    let pitchLetter = 'C';
    const accidentals = ['__', '_', '=', '^', '^^'];
    let deviation = -2;

    for(let accidental of accidentals) {
        expect(getDeviationFromKeySignature(pitchLetter, accidental, CMAJOR.keySig)).toBe(deviation);
        deviation++;
    }

    const DMAJOR = KEYS.get(2)[0];
    pitchLetter = 'F';
    deviation = -3;

    for(let accidental of accidentals) {
        expect(getDeviationFromKeySignature(pitchLetter, accidental, DMAJOR.keySig)).toBe(deviation);
        deviation++;
    }

    const BbMajor = KEYS.get(10)[0];
    pitchLetter = 'E';
    deviation = -1;

    for(let accidental of accidentals) {
        expect(getDeviationFromKeySignature(pitchLetter, accidental, BbMajor.keySig)).toBe(deviation);
        deviation++;
    }
});

test('Expect getDeviationFromKeySignature to throw an error with incorrect input.', () => {
    const validPitch = 'C';
    const validKey = KEYS.get(0)[0];
    const validAccidental = "=";
    
    const invalidPitch = 'a';
    const invalidKey = {};
    const invalidAccidental = '*';

    expect(() => getDeviationFromKeySignature(invalidPitch, validAccidental, validKey)).toThrow(new Error("pitchLetter must be a capital letter between A and G"));
    expect(() => getDeviationFromKeySignature(validPitch, invalidAccidental, validKey)).toThrow(new Error("Invalid accidental."));
    expect(() => getDeviationFromKeySignature(validPitch, validAccidental, invalidKey)).toThrow(new Error("Could not find pitchLetter in the supplied key signature object."));
});