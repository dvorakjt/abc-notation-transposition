const {updateStoredAccidentals} = require('../../../../functions/transposition-utils');

test('Expect updateStoredAccidentals to correctly update stored accidentals.', () => {
    const storedAccidentals = {
        A: "=",
        B: "_",
        C: "^",
        D: "__",
        E: "^^",
        F: "=",
        G: "="
    }
    updateStoredAccidentals(storedAccidentals, 'A', '_');
    expect(storedAccidentals.A).toBe('_');

    updateStoredAccidentals(storedAccidentals, 'B', '=');
    expect(storedAccidentals.B).toBe('=');
})