const {getKeyStrFromField} = require('../../../../functions/transpose-abc');

test('Expect getKeyStrFromField to extract a valid key string.', () => {
    const field1 = 'K:';
    expect(getKeyStrFromField(field1)).toBe('');

    const field2 = 'K:C';
    expect(getKeyStrFromField(field2)).toBe('C');

    const field3 = 'K:   C   ';
    expect(getKeyStrFromField(field3)).toBe('C');

    const field4 = 'K: C phrygian';
    expect(getKeyStrFromField(field4)).toBe('Cphrygian');

    const field5 = 'K:   A    major';
    expect(getKeyStrFromField(field5)).toBe('A');

    const field6 = 'K: transpose=-2 clef=treble';
    expect(getKeyStrFromField(field6)).toBe('');

    const field7 = 'K:none';
    expect(getKeyStrFromField(field7)).toBe('none');

    const field8 = 'K:Dbminor';
    expect(getKeyStrFromField(field8)).toBe('Dbminor');

    const field9 = 'K:none middle=C';
    expect(getKeyStrFromField(field9)).toBe('none');

    const field10 = 'K:C#m';
    expect(getKeyStrFromField(field10)).toBe('C#m');

    const field11 = 'K:    HP    ';
    expect(getKeyStrFromField(field11)).toBe('HP');

    const field12 = 'K:Hp';
    expect(getKeyStrFromField(field12)).toBe('Hp');
});