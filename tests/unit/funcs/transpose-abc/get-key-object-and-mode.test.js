const {getKeyObjectAndMode} = require('../../../../functions/transpose-abc');
const {KEYS} = require('../../../../constants');
const {ImproperlyFormattedABCNotationError} = require('../../../../classes');

test('Expect bagpipe ("HP", "Hp") and atonal keys ("none", "") to return an array containing the original string and undefined', () => {
    expect(getKeyObjectAndMode('HP')).toEqual(['HP', undefined]);
    expect(getKeyObjectAndMode('Hp')).toEqual(['Hp', undefined]);
    expect(getKeyObjectAndMode('none')).toEqual(['none', undefined]);
    expect(getKeyObjectAndMode('')).toEqual(['', undefined]);
});

test('Expect major, minor and modal scales to return their corresponding key object and their mode in an array', () => {
    const CMAJOR = KEYS.get(0)[0];
    expect(getKeyObjectAndMode('C')).toEqual([CMAJOR, 'major']);
    expect(getKeyObjectAndMode('Aminor')).toEqual([CMAJOR, 'minor']);
    expect(getKeyObjectAndMode('Amin')).toEqual([CMAJOR, 'minor']);
    expect(getKeyObjectAndMode('Am')).toEqual([CMAJOR, 'minor']);
    expect(getKeyObjectAndMode('Ddorian')).toEqual([CMAJOR, 'dorian']);
    expect(getKeyObjectAndMode('Ddor')).toEqual([CMAJOR, 'dorian']);
    expect(getKeyObjectAndMode('Ephrygian')).toEqual([CMAJOR, 'phrygian']);
    expect(getKeyObjectAndMode('Ephr')).toEqual([CMAJOR, 'phrygian']);
    expect(getKeyObjectAndMode('Flydian')).toEqual([CMAJOR, 'lydian']);
    expect(getKeyObjectAndMode('Flyd')).toEqual([CMAJOR, 'lydian']);
    expect(getKeyObjectAndMode('Gmixolydian')).toEqual([CMAJOR, 'mixolydian']);
    expect(getKeyObjectAndMode('Gmix')).toEqual([CMAJOR, 'mixolydian']);
    expect(getKeyObjectAndMode('Aaeolian')).toEqual([CMAJOR, 'aeolian']);
    expect(getKeyObjectAndMode('Aaeo')).toEqual([CMAJOR, 'aeolian']);
    expect(getKeyObjectAndMode('Blocrian')).toEqual([CMAJOR, 'locrian']);
    expect(getKeyObjectAndMode('Bloc')).toEqual([CMAJOR, 'locrian']);
});

test('Expect improperly formatted key strings to throw an error', () => {
    const badKeySignature = 'This is not a key signature';
    expect(() => getKeyObjectAndMode(badKeySignature)).toThrow(new ImproperlyFormattedABCNotationError(`Key signature ${badKeySignature} not found in keys. Please check your ABC notation to ensure it contains a valid key.`));
});