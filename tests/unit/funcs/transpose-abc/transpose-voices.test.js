const {transposeVoices} = require('../../../../functions/transpose-abc');
const {KEYS, INTERVALS} = require('../../../../constants');

test('Expect transpose voices to correctly transpose transposable voices and ignore voices with a clef of perc or a key of HP/Hp', () => {
    voicesObject = {
        Flute : [
            {
                originalLine : 0,
                abcNotation: 'V: Flute clef=treble'
            },
            {
                originalLine : 1,
                abcNotation: 'ABcd|=de3|'
            },
            {
                originalLine: 2,
                abcNotation: '[K: Eb]'
            },
            {
                originalLine: 3,
                abcNotation: 'd_dcA|]'
            }
        ],
        Bagpipes : [
            {
                originalLine : 4,
                abcNotation: '[V: Bagpipes clef=treble]'
            },
            {
                originalLine : 5,
                abcNotation: '[K:HP]'
            },
            {
                originalLine : 6,
                abcNotation: 'ABcd|=de3|'
            },
            {
                originalLine: 7,
                abcNotation: 'd_dcA|]'
            }
        ],
        SnareDrum : [
            {
                originalLine : 8,
                abcNotation: '[V: SnareDrum]'
            },
            {
                originalLine : 9,
                abcNotation: 'ABcd|=de3|'
            },
            {
                originalLine: 10,
                abcNotation: '[K: Eb]'
            },
            {
                originalLine: 11,
                abcNotation: 'd_dcA|]'
            }
        ],
    }

    //KEYS should be its own class that extends SimpleCircularArray and offers a FindKey function
    startingKey = KEYS.find((keyPair) => keyPair.findIndex(key => key.major === 'Ab') !== -1).find(key => key.major === 'Ab');

    originalMode = 'major';

    transposedKey = KEYS.find((keyPair) => keyPair.findIndex(key => key.major === 'Bb') !== -1).find(key => key.major === 'Bb');

    voiceNamesAndClefs = {
        SnareDrum : 'perc'
    }
    
    defaultClef = 'bass'

    halfSteps = INTERVALS.ASCENDING.MAJOR_SECOND;

    expect(transposeVoices(voicesObject, startingKey, originalMode, transposedKey, voiceNamesAndClefs, defaultClef, halfSteps))
    .toEqual({
        Flute: [
          { originalLine: 0, abcNotation: 'V: Flute clef=treble' },
          { originalLine: 1, abcNotation: 'Bcde|=ef3|' },
          { originalLine: 2, abcNotation: '[K:Fmajor]' },
          { originalLine: 3, abcNotation: 'e_edB|]' }
        ],
        Bagpipes: [
          { originalLine: 4, abcNotation: '[V: Bagpipes clef=treble]' },
          { originalLine: 5, abcNotation: '[K:HP]' },
          { originalLine: 6, abcNotation: 'ABcd|=de3|' },
          { originalLine: 7, abcNotation: 'd_dcA|]' }
        ],
        SnareDrum: [
          { originalLine: 8, abcNotation: '[V: SnareDrum]' },
          { originalLine: 9, abcNotation: 'ABcd|=de3|' },
          { originalLine: 10, abcNotation: '[K:Fmajor]' },
          { originalLine: 11, abcNotation: 'd_dcA|]' }
        ]
    });
});