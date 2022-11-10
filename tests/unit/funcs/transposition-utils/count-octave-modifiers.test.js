const {countOctaveModifiers} = require('../../../../functions/transposition-utils');
const {INTERVALS} = require('../../../../constants');

test('Expect countOctaveModifiers to correctly count the number of positive octave modifiers applied to a pitch transposed up.', () => {
    expect(countOctaveModifiers('=A', 'B', INTERVALS.ASCENDING.MAJOR_SECOND)).toBe(0);
    expect(countOctaveModifiers('=C', 'B', INTERVALS.ASCENDING.MAJOR_SEVENTH)).toBe(0);
    expect(countOctaveModifiers('=B,', 'C', INTERVALS.ASCENDING.MINOR_SECOND)).toBe(1);
    expect(countOctaveModifiers('=a', 'A', INTERVALS.ASCENDING.OCTAVE * 2)).toBe(2);
    expect(countOctaveModifiers("=b'", 'C', INTERVALS.ASCENDING.OCTAVE * 2 + INTERVALS.ASCENDING.MINOR_SECOND)).toBe(3);
});

test('Expect countOctaveModifiers to correctly count the number of negative octave modifiers applied to a pitch transposed down.', () => {
    expect(countOctaveModifiers('=B', 'A', INTERVALS.DESCENDING.MAJOR_SECOND)).toBe(0);
    expect(countOctaveModifiers('=B', 'C', INTERVALS.DESCENDING.MAJOR_SEVENTH)).toBe(0);
    expect(countOctaveModifiers('=C,', 'A', INTERVALS.DESCENDING.MINOR_THIRD)).toBe(-1);
    expect(countOctaveModifiers('=d', 'D', INTERVALS.DESCENDING.OCTAVE * 2)).toBe(-2);
    expect(countOctaveModifiers("=d'", 'B', INTERVALS.DESCENDING.OCTAVE * 2 + INTERVALS.DESCENDING.MINOR_THIRD)).toBe(-3);
});