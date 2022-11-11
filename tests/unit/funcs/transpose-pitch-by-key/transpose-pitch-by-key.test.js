const {transposePitchByKey} = require('../../../../functions/transpose-pitch-by-key');
const {KEYS} = require('../../../../constants');

test('Expect transposePitchByKey to correctly transpose pitches to and from various keys.', () => {
    const CMAJOR = KEYS.get(0)[0];
    const DMAJOR = KEYS.get(2)[0];
    const voiceState = {
        originalKey : CMAJOR,
        mode : 'major',
        transposedKey : DMAJOR,
        originalAccidentals : Object.assign({}, CMAJOR.keySig),
        transposedAccidentals : Object.assign({}, DMAJOR.keySig),
        clef : 'treble'
    }

    expect(transposePitchByKey('c', voiceState, 2)).toBe('d');
    
    const EMAJOR = KEYS.get(4)[0];
    voiceState.transposedKey = EMAJOR;
    voiceState.transposedAccidentals = Object.assign({}, EMAJOR.keySig);

    expect(transposePitchByKey('^f', voiceState, 16)).toBe("^a'");
});