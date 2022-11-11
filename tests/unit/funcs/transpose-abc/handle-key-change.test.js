const {handleKeyChange} = require('../../../../functions/transpose-abc');
const {KEYS, ACCIDENTAL_NUMBER_PREFERENCES, SHARPS_OR_FLATS_PREFERENCES} = require('../../../../constants');

test('Expect handleKeyChange to detect a key change, update the voiceState object appropriately and return the new key field.', () => {
    const CMAJOR = KEYS.get(0)[0];
    const EMAJOR = KEYS.get(4)[0];
    const DMINOR = KEYS.get(5)[0];
    const FSHARPMINOR = KEYS.get(9)[0];
    const voiceState = {
        originalKey : CMAJOR,
        mode : 'major',
        transposedKey : EMAJOR,
        originalAccidentals : Object.assign({}, CMAJOR.keySig),
        transposedAccidentals : Object.assign({}, EMAJOR.keySig),
        clef : 'treble'
    }
    const voiceLine = '[K:Dminor transpose=-2 octave=+1 stafflines=5]';
    const opts = {
        accidentalNumberPreference: ACCIDENTAL_NUMBER_PREFERENCES.PREFER_FEWER,
        preferSharpsOrFlats: SHARPS_OR_FLATS_PREFERENCES.PRESERVE_ORIGINAL
    }
    const expectedVoiceState = {
        originalKey: DMINOR,
        mode: 'minor',
        transposedKey: FSHARPMINOR,
        originalAccidentals: Object.assign({}, DMINOR.keySig),
        transposedAccidentals: Object.assign({}, FSHARPMINOR.keySig),
        clef: 'treble'
    }
    expect(handleKeyChange(voiceLine, voiceState, 4, opts)).toBe('[K:F#minor transpose=-2 octave=+1 stafflines=5]');
    expect(voiceState).toEqual(expectedVoiceState);
});

test('Expect handle key change to return a key field line when no brackets are present.', () => {
    const CMAJOR = KEYS.get(0)[0];
    const EMAJOR = KEYS.get(4)[0];
    const DMINOR = KEYS.get(5)[0];
    const FSHARPMINOR = KEYS.get(9)[0];
    const voiceState = {
        originalKey : CMAJOR,
        mode : 'major',
        transposedKey : EMAJOR,
        originalAccidentals : Object.assign({}, CMAJOR.keySig),
        transposedAccidentals : Object.assign({}, EMAJOR.keySig),
        clef : 'treble'
    }
    const voiceLine = 'K:Dminor transpose=-2 octave=+1 stafflines=5';
    const opts = {
        accidentalNumberPreference: ACCIDENTAL_NUMBER_PREFERENCES.PREFER_FEWER,
        preferSharpsOrFlats: SHARPS_OR_FLATS_PREFERENCES.PRESERVE_ORIGINAL
    }
    expect(handleKeyChange(voiceLine, voiceState, 4, opts)).toBe('K:F#minor transpose=-2 octave=+1 stafflines=5');
});