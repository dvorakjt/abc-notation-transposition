const {applyDeviation} = require('../../../../functions/transpose-pitch-by-key');
const {KEYS} = require('../../../../constants');

test('Expect applyDeviation to correctly modify pitches based on the starting key. G, C major, 0 => ["G", "=", false]', () => {
    const CMAJOR = KEYS.get(0)[0];
    const storedAccidentals = Object.assign({}, CMAJOR.keySig);
    let pitchLetter = 'G';

    expect(applyDeviation(pitchLetter, CMAJOR.keySig, 0, storedAccidentals)).toEqual(['G', '=', false]);
});

test('Expect applyDeviation to correctly modify pitches based on the starting key. G, C major, 0 => ["G", "=", true]', () => {
    const CMAJOR = KEYS.get(0)[0];
    const storedAccidentals = Object.assign({}, CMAJOR.keySig);
    storedAccidentals.G = "^"
    let pitchLetter = 'G';

    expect(applyDeviation(pitchLetter, CMAJOR.keySig, 0, storedAccidentals)).toEqual(['G', '=', true]);
});

test('Expect applyDeviation to correctly modify pitches based on the starting key. G, C major, 1 => ["G", "^", true]', () => {
    const CMAJOR = KEYS.get(0)[0];
    const storedAccidentals = Object.assign({}, CMAJOR.keySig);
    let pitchLetter = 'G';

    expect(applyDeviation(pitchLetter, CMAJOR.keySig, 1, storedAccidentals)).toEqual(['G', '^', true]);
});

test('Expect applyDeviation to correctly modify pitches based on the starting key. G, C major, 2 => ["G", "^^", true]', () => {
    const CMAJOR = KEYS.get(0)[0];
    const storedAccidentals = Object.assign({}, CMAJOR.keySig);
    let pitchLetter = 'G';

    expect(applyDeviation(pitchLetter, CMAJOR.keySig, 2, storedAccidentals)).toEqual(['G', '^^', true]);
});

test('Expect applyDeviation to correctly modify pitches based on the starting key. G, C major, 3 => ["A", "^", true]', () => {
    const CMAJOR = KEYS.get(0)[0];
    const storedAccidentals = Object.assign({}, CMAJOR.keySig);
    let pitchLetter = 'G';

    expect(applyDeviation(pitchLetter, CMAJOR.keySig, 3, storedAccidentals)).toEqual(['A', '^', true]);
    expect(storedAccidentals.A).toBe('^');
});

test('Expect applyDeviation to correctly modify pitches based on the starting key. G, C major, -1 => ["G", "_", true]', () => {
    const CMAJOR = KEYS.get(0)[0];
    const storedAccidentals = Object.assign({}, CMAJOR.keySig);
    let pitchLetter = 'G';

    expect(applyDeviation(pitchLetter, CMAJOR.keySig, -1, storedAccidentals)).toEqual(['G', '_', true]);
});

test('Expect applyDeviation to correctly modify pitches based on the starting key. G, Db major, -1 => ["G", "__", true]', () => {
    const DbMAJOR = KEYS.get(1)[1];
    const storedAccidentals = Object.assign({}, DbMAJOR.keySig);
    let pitchLetter = 'G';

    expect(applyDeviation(pitchLetter, DbMAJOR.keySig, -1, storedAccidentals)).toEqual(['G', '__', true]);
});

test('Expect applyDeviation to correctly modify pitches based on the starting key. G, C major, -2 => ["G", "__", true]', () => {
    const CMAJOR = KEYS.get(0)[0];
    const storedAccidentals = Object.assign({}, CMAJOR.keySig);
    let pitchLetter = 'G';

    expect(applyDeviation(pitchLetter, CMAJOR.keySig, -2, storedAccidentals)).toEqual(['G', '__', true]);
});

test('Expect applyDeviation to correctly modify pitches based on the starting key. F, G major, 2 => ["G", "^", true]', () => {
    const GMAJOR = KEYS.get(7)[0];
    const storedAccidentals = Object.assign({}, GMAJOR.keySig);
    let pitchLetter = 'F';

    expect(applyDeviation(pitchLetter, GMAJOR.keySig, 2, storedAccidentals)).toEqual(['G', '^', true]);
});

test('Expect applyDeviation to correctly modify pitches based on the starting key. A, Eb major, 2 => ["E", "^", true]', () => {
    const AbMAJOR = KEYS.get(8)[0];
    const storedAccidentals = Object.assign({}, AbMAJOR.keySig);
    let pitchLetter = 'E';

    expect(applyDeviation(pitchLetter, AbMAJOR.keySig, 2, storedAccidentals)).toEqual(['E', '^', true]);
});

test('Expect applyDeviation to correctly modify pitches based on the starting key. B, Bb major, -2 => ["A", "_", true]', () => {
    const BbMAJOR = KEYS.get(10)[0];
    const storedAccidentals = Object.assign({}, BbMAJOR.keySig);
    let pitchLetter = 'B';

    expect(applyDeviation(pitchLetter, BbMAJOR.keySig, -2, storedAccidentals)).toEqual(['A', '_', true]);
});

test('Expect applyDeviation to correctly modify pitches based on the starting key. G, A major, -2 => ["G", "_", true]', () => {
    const AMAJOR = KEYS.get(9)[0];
    const storedAccidentals = Object.assign({}, AMAJOR.keySig);
    let pitchLetter = 'G';

    expect(applyDeviation(pitchLetter, AMAJOR.keySig, -2, storedAccidentals)).toEqual(['G', '_', true]);
});

test('Expect applyDeviation to correctly modify pitches based on the starting key. G, C major, -3 => ["E", "=", false]', () => {
    const CMAJOR = KEYS.get(0)[0];
    const storedAccidentals = Object.assign({}, CMAJOR.keySig);
    let pitchLetter = 'G';

    expect(applyDeviation(pitchLetter, CMAJOR.keySig, -3, storedAccidentals)).toEqual(['E', '=', false]);
});

test('Expect applyDeviation to correctly modify pitches based on the starting key. G, Bb major, -4 => ["E", "_", false]', () => {
    const BbMAJOR = KEYS.get(10)[0];
    const storedAccidentals = Object.assign({}, BbMAJOR.keySig);
    let pitchLetter = 'G';

    expect(applyDeviation(pitchLetter, BbMAJOR.keySig, -4, storedAccidentals)).toEqual(['E', '_', false]);
});