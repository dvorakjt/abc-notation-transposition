const {getPitchLetter} = require('../../../../functions/transposition-utils');

test('Expect getPitchLetter to return a capital letter from A-G when passed a pitch.', () => {
    expect(getPitchLetter('c')).toBe('C');
    expect(getPitchLetter('=c')).toBe('C');
    expect(getPitchLetter('_D')).toBe('D');
    expect(getPitchLetter('^d')).toBe('D');
    expect(getPitchLetter('__e')).toBe('E');
    expect(getPitchLetter('^^E,,,')).toBe('E');
    expect(getPitchLetter("f'''")).toBe('F');
    expect(getPitchLetter('g')).toBe('G');
    expect(getPitchLetter('__A,')).toBe('A');
    expect(getPitchLetter('_b')).toBe('B');
});