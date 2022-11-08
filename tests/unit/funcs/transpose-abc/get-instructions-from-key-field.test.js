const {getInstructionsFromKeyField} = require('../../../../functions/transpose-abc');

test('Expect getInstructionsFromKeyField to return legal key field instructions joined by space characters.', () => {
    const testKeyField = 'K:C    clef=treble+8   middle=B transpose=-2  octave=-2  stafflines=5';
    expect(getInstructionsFromKeyField(testKeyField)).toBe(' clef=treble+8 middle=B transpose=-2 octave=-2 stafflines=5');
});