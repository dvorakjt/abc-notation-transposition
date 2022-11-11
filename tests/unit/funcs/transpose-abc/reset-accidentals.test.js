const {resetAccidentals} = require('../../../../functions/transpose-abc');
const {KEYS} = require('../../../../constants');

test('Expect reset accidentals to correctly revert stored accidentals to those of the current key signature.', () => {
    const CMAJOR = KEYS.get(0)[0];
    const DMAJOR = KEYS.get(2)[0];
    const voiceState = {
        originalKey : CMAJOR,
        transposedKey: DMAJOR,
        originalAccidentals: {
            A: "=",
            B: "=",
            C: "=",
            D: "=",
            E: "=",
            F: "^",
            G: "^",
        },
        transposedAccidentals: {
            A: "^",
            B: "=",
            C: "^",
            D: "=",
            E: "=",
            F: "^",
            G: "^",
        }
    }
    resetAccidentals(voiceState);
    expect(voiceState.originalAccidentals.F).toBe('=');
    expect(voiceState.originalAccidentals.G).toBe('=');
    expect(voiceState.transposedAccidentals.G).toBe('=');
    expect(voiceState.transposedAccidentals.A).toBe('=');
    expect(voiceState.transposedAccidentals.F).toBe('^');
    expect(voiceState.transposedAccidentals.C).toBe('^');
});

