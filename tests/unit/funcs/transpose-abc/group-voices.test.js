const {groupVoices} = require('../../../../functions/transpose-abc');

test('Expect groupVoices to return one voice with a voiceName of "" when no voice names are specified', () => {
    expect(groupVoices('ABCD|EFGA|\nGFED|CDA2|]')).toEqual({
        "" : [
            {
                originalLine: 0,
                abcNotation: 'ABCD|EFGA|'
            },
            {
                originalLine: 1,
                abcNotation: 'GFED|CDA2|]'
            }
        ]
    })
});

test('Expect group voices to group voices by name when voice names are specified as field lines and inline fields.', () => {
    const abcNotation = 'V: Voice1 clef=treble \n ABCD|EFGA|][V: Voice2]abcd|\nefga|]';
    const expectedOutput = {
        Voice1: [
            {
                abcNotation: 'V: Voice1 clef=treble ',
                originalLine: 0
            },
            {
                abcNotation: ' ABCD|EFGA|]',
                originalLine: 1
            }
        ],
        Voice2: [
            {
                abcNotation: '[V: Voice2]',
                originalLine: 2
            },
            {
                abcNotation: 'abcd|',
                originalLine: 3
            },
            {
                abcNotation: 'efga|]',
                originalLine: 4
            }
        ]
    }
    expect(groupVoices(abcNotation)).toEqual(expectedOutput);
});