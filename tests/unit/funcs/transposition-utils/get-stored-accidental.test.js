const {getStoredAccidental} = require('../../../../functions/transposition-utils');

const storedAccidentals = {
    A: "=",
    B: "_",
    C: "^",
    D: "__",
    E: "^^",
    F: "=",
    G: "="
}

test('Expect getStoredAccidental to correctly return stored accidental from state object.', () => {
    expect(getStoredAccidental(storedAccidentals, 'A')).toBe('=');
    expect(getStoredAccidental(storedAccidentals, 'B')).toBe('_');
    expect(getStoredAccidental(storedAccidentals, 'C')).toBe('^');
    expect(getStoredAccidental(storedAccidentals, 'D')).toBe('__');
    expect(getStoredAccidental(storedAccidentals, 'E')).toBe('^^');
    expect(getStoredAccidental(storedAccidentals, 'F')).toBe('=');
    expect(getStoredAccidental(storedAccidentals, 'G')).toBe('=');
});

test('Expect getStoredAccidental to throw an error when passed an invalid pitch.', () => {
    expect(() => getStoredAccidental(storedAccidentals, 'Q')).toThrow(new Error("Could not find pitch letter Q in stored accidentals object."));
})