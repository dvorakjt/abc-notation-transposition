const {getTransposedPitchAtOctave} = require('../../../../functions/transposition-utils');

test('Expect getTransposedPitchAtOctave to corrently return the octave-modified transposed pitch.', () => {
    expect(getTransposedPitchAtOctave('=c', 'C', 0)).toBe('c');

    expect(getTransposedPitchAtOctave('=c', 'C', 1)).toBe('c');
    expect(getTransposedPitchAtOctave('=c', 'B', -1)).toBe('B');
    expect(getTransposedPitchAtOctave('=d', 'E', 1)).toBe('e');

    expect(getTransposedPitchAtOctave("=c'", 'D', 2)).toBe("d'");
    expect(getTransposedPitchAtOctave('=B', 'C', 2)).toBe('c');
    expect(getTransposedPitchAtOctave("=c'''", 'B', -2)).toBe("b''");

    expect(getTransposedPitchAtOctave('=C,', 'A', -3)).toBe('A,,');
    expect(getTransposedPitchAtOctave('=A', 'C', 3)).toBe('c');
    expect(getTransposedPitchAtOctave('=D,,', 'B', -3)).toBe('B,,,');

    expect(getTransposedPitchAtOctave('_B', 'D', 4)).toBe('d');
    expect(getTransposedPitchAtOctave('=D', 'B', -4)).toBe('B,');

    expect(getTransposedPitchAtOctave('=B', 'B', 12)).toBe('b');

    expect(getTransposedPitchAtOctave('=C', 'D', 14)).toBe('d');

    expect(getTransposedPitchAtOctave('=B', 'B', 24)).toBe("b'");
    expect(getTransposedPitchAtOctave("c''", 'C', -24)).toBe('c');

    expect(getTransposedPitchAtOctave('A,,', 'C', 51)).toBe("c''");
});