const {getVoiceName} = require('../../../../functions/transpose-abc');

test('getVoiceName should return null if no voiceName is specified in the line.', () => {
    expect(getVoiceName('ABCD|EFGA|]')).toBe(null);
});

test('getVoiceName should return the first string of word characters after a V:', () => {
    expect(getVoiceName('V:   Bassoon1')).toBe('Bassoon1');
    expect(getVoiceName('ABCD|[V:Alto2]EFGA|]')).toBe('Alto2');
});