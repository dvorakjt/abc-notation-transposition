const {transposeKey} = require('../../../../functions/transpose-key');
const {ACCIDENTAL_NUMBER_PREFERENCES, SHARPS_OR_FLATS_PREFERENCES} = require('../../../../constants');

const defaultOpts = {
    accidentalNumberPreference: ACCIDENTAL_NUMBER_PREFERENCES.PREFER_FEWER,
    preferSharpsOrFlats: SHARPS_OR_FLATS_PREFERENCES.PRESERVE_ORIGINAL
}

test('Expect an empty string and "none" to return the same values, respectively.', () => {
    expect(transposeKey('', 1, defaultOpts)).toBe('');
    expect(transposeKey('none', 99, defaultOpts)).toBe('none');
})

test('Expect a key transposed by 0 steps or by an octave to return the same key', () => {
    expect(transposeKey("C", 0, defaultOpts).major).toBe("C");
    expect(transposeKey("C", 12, defaultOpts).major).toBe("C");
    expect(transposeKey("C", -12, defaultOpts).major).toBe("C");
    expect(transposeKey("C", 24, defaultOpts).major).toBe("C");
    expect(transposeKey("C", -24, defaultOpts).major).toBe("C");
});

test('Expect major keys transposed by a half step to transpose up correctly. Expect keys with fewer accidentals to be favored.', () => { 
    expect(transposeKey("C", 1, defaultOpts).major).toBe("Db");
    expect(transposeKey("C#", 1, defaultOpts).major).toBe("D");
    expect(transposeKey("Db", 1, defaultOpts).major).toBe("D");
    expect(transposeKey("D", 1, defaultOpts).major).toBe("Eb");
    expect(transposeKey("Eb", 1, defaultOpts).major).toBe("E");
    expect(transposeKey("E", 1, defaultOpts).major).toBe("F");
    expect(transposeKey("F", 1, defaultOpts).major).toBe("Gb");
    expect(transposeKey("F#", 1, defaultOpts).major).toBe("G");
    expect(transposeKey("G", 1, defaultOpts).major).toBe("Ab");
    expect(transposeKey("Ab", 1, defaultOpts).major).toBe("A");
    expect(transposeKey("A", 1, defaultOpts).major).toBe("Bb");
    expect(transposeKey("Bb", 1, defaultOpts).major).toBe("B");
    expect(transposeKey("B", 1, defaultOpts).major).toBe("C");
});

test('Expect major keys transposed down by a half step to transpose down correctly. Expect keys with fewer accidentals to be favored.', () => {
    expect(transposeKey("C", -1, defaultOpts).major).toBe("B");
    expect(transposeKey("C#", -1, defaultOpts).major).toBe("C");
    expect(transposeKey("Db", -1, defaultOpts).major).toBe("C");
    expect(transposeKey("D", -1, defaultOpts).major).toBe("Db");
    expect(transposeKey("Eb", -1, defaultOpts).major).toBe("D");
    expect(transposeKey("E", -1, defaultOpts).major).toBe("Eb");
    expect(transposeKey("F", -1, defaultOpts).major).toBe("E");
    expect(transposeKey("F#", -1, defaultOpts).major).toBe("F");
    expect(transposeKey("G", -1, defaultOpts).major).toBe("F#");
    expect(transposeKey("Ab", -1, defaultOpts).major).toBe("G");
    expect(transposeKey("A", -1, defaultOpts).major).toBe("Ab");
    expect(transposeKey("Bb", -1, defaultOpts).major).toBe("A");
    expect(transposeKey("B", -1, defaultOpts).major).toBe("Bb");
});

test('Expect all modes to transpose correctly. Expect keys with fewer accidentals to be favored.', () => {
    expect(transposeKey("Cdor", 2, defaultOpts).dorian).toBe("D");
    expect(transposeKey("C#Phr", 3, defaultOpts).phrygian).toBe("E");
    expect(transposeKey("Dblydian", 4, defaultOpts).lydian).toBe("F");
    expect(transposeKey("Dmix", 4, defaultOpts).mixolydian).toBe("F#");
    expect(transposeKey("Ebm", -1, defaultOpts).minor).toBe("D");
    expect(transposeKey('Caeo', 2, defaultOpts).aeolian).toBe('D');
    expect(transposeKey("Elocrian", 11, defaultOpts).locrian).toBe("D#");
});

test('Expect PREFER_FEWER to work correctly with PREFER_SHARPS and PREFER_FLATS', () => {
    const opts = {
        accidentalNumberPreference: ACCIDENTAL_NUMBER_PREFERENCES.PREFER_FEWER,
        preferSharpsOrFlats: SHARPS_OR_FLATS_PREFERENCES.PREFER_SHARPS
    }
    expect(transposeKey('E', 2, opts).major).toBe("F#");
    expect(transposeKey('Ab', -2, opts).major).toBe("F#");

    opts.preferSharpsOrFlats = SHARPS_OR_FLATS_PREFERENCES.PREFER_FLATS;

    expect(transposeKey('E', 2, opts).major).toBe('Gb');
    expect(transposeKey('Ab', -2, opts).major).toBe('Gb');
});

test('Expect keys with more accidentals to be favored.', () => {
    const opts = {
        accidentalNumberPreference: ACCIDENTAL_NUMBER_PREFERENCES.PREFER_MORE,
        preferSharpsOrFlats: SHARPS_OR_FLATS_PREFERENCES.PRESERVE_ORIGINAL
    }
    expect(transposeKey('B', 0, opts).major).toBe("Cb");
    expect(transposeKey('Db', 0, opts).major).toBe("C#");
    expect(transposeKey('F', 1, opts).major).toBe('Gb');
    expect(transposeKey('G', -1, opts).major).toBe('F#');
});

test('Expect flat keys to be favored', () => {
    const opts = {
        accidentalNumberPreference: ACCIDENTAL_NUMBER_PREFERENCES.NO_PREFERENCE,
        preferSharpsOrFlats: SHARPS_OR_FLATS_PREFERENCES.PREFER_FLATS
    }
    expect(transposeKey('F', 1, opts).major).toBe("Gb");
    expect(transposeKey('C', -1, opts).major).toBe('Cb');
    expect(transposeKey('D', -1, opts).major).toBe('Db');

    opts.preferSharpsOrFlats = SHARPS_OR_FLATS_PREFERENCES.PRESERVE_ORIGINAL;

    expect(transposeKey('F', 1, opts).major).toBe("Gb");
});

test('Expect sharp keys to be favored', () => {
    const opts = {
        accidentalNumberPreference: ACCIDENTAL_NUMBER_PREFERENCES.NO_PREFERENCE,
        preferSharpsOrFlats: SHARPS_OR_FLATS_PREFERENCES.PREFER_SHARPS
    }
    expect(transposeKey('F', 1, opts).major).toBe("F#");
    expect(transposeKey('C', -1, opts).major).toBe('B');
    expect(transposeKey('D', -1, opts).major).toBe('C#');
});

test('Expect sharp keys to yield sharp keys and flat keys to yield flat keys', () => {
    const opts = {
        accidentalNumberPreference: ACCIDENTAL_NUMBER_PREFERENCES.NO_PREFERENCE,
        preferSharpsOrFlats: SHARPS_OR_FLATS_PREFERENCES.PRESERVE_ORIGINAL
    }
    expect(transposeKey('F', 1, opts).major).toBe("Gb");
    expect(transposeKey('D', -1, opts).major).toBe('C#');
    expect(transposeKey('C', -1, opts).major).toBe('Cb');
});