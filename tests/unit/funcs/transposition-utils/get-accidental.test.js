const {getAccidental} = require('../../../../functions/transposition-utils');

test('Expect getAccidental to return null for pitches lacking an accidental.', () => {
    expect(getAccidental('C,')).toBe(null);
    expect(getAccidental("d'''")).toBe(null);
});

test('Expect getAccidental to return correct accidentals for pitches with an accidental.', () => {
    expect(getAccidental('__B')).toBe('__');
    expect(getAccidental('_a')).toBe('_');
    expect(getAccidental("=c'")).toBe('=');
    expect(getAccidental('^d')).toBe('^');
    expect(getAccidental('^^G')).toBe('^^');
});