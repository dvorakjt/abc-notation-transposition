const {applyOctaveModifiers} = require('../../../../functions/transposition-utils');

test('Expect applyOctaveModifiers to return the transposed pitch letter at the correct octave.', () => {
    expect(applyOctaveModifiers('=C', 'D', 0)).toBe('D');
    expect(applyOctaveModifiers('=C,', 'D', 0)).toBe('D,');
    expect(applyOctaveModifiers('^c', 'D', 0)).toBe('d');
    expect(applyOctaveModifiers("^c'", 'D', 0)).toBe("d'");
    expect(applyOctaveModifiers('=C', 'A', -1)).toBe('A,');
    expect(applyOctaveModifiers('=c', 'A', -1)).toBe('A');
    expect(applyOctaveModifiers("=c'", 'A', -1)).toBe('a');
    expect(applyOctaveModifiers("=c''", 'A', -1)).toBe("a'");
    expect(applyOctaveModifiers("=c'", "C", -2)).toBe('C');
    expect(applyOctaveModifiers('=C,,', 'C', 1)).toBe('C,');
    expect(applyOctaveModifiers('=C,', 'C', 1)).toBe('C');
    expect(applyOctaveModifiers('=C', 'C', 1)).toBe('c');
    expect(applyOctaveModifiers('c', 'C', 1)).toBe("c'");
    expect(applyOctaveModifiers("c'", 'C', 1)).toBe("c''");
    expect(applyOctaveModifiers('C,', 'C', 3)).toBe("c'");
});