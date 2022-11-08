const {validateInput} = require('../../../../functions/transpose-abc');
const {ERROR_MESSAGES} = require('../../../../constants');

const invalidOpts = {
    foo : 'bar'
}

const validOptsInvalidFieldTypes = {
    accidentalNumberPreference: false,
    preferSharpsOrFlats: 'foo'
}

const validOptsFloatingPointFields = {
    accidentalNumberPreference : 1.13,
    preferSharpsOrFlats: 0.52
}

const validOptsInvalidFieldValues = {
    accidentalNumberPreference: 60,
    preferSharpsOrFlats: -60
}

const validOptsValidFields = {  
    accidentalNumberPreference: 0,
    preferSharpsOrFlats: 2
}

test('Expect validate input to throw errors when incorrectly typed parameters are supplied.', () => {
    expect(() => validateInput()).toThrow(new TypeError(ERROR_MESSAGES.ABC_NOTATION_TYPE_MISMATCH + 'undefined'));
    expect(() => validateInput(3)).toThrow(new TypeError(ERROR_MESSAGES.ABC_NOTATION_TYPE_MISMATCH + 'number'));
    expect(() => validateInput('X:1\nK:C\nCDEF|]')).toThrow(new TypeError(ERROR_MESSAGES.HALF_STEPS_TYPE_MISMATCH + 'undefined'));
    expect(() => validateInput('X:1\nK:C\nCDEF|]', 3.14)).toThrow(new TypeError(ERROR_MESSAGES.HALF_STEPS_TYPE_MISMATCH + 'floating point'));
    expect(() => validateInput('X:1\nK:C\nCDEF|]', 3, invalidOpts)).toThrow(new TypeError(ERROR_MESSAGES.OPTS_OBJECT_TYPE_MISMATCH));
    expect(() => validateInput('X:1\nK:C\nCDEF|]', 3, validOptsInvalidFieldTypes)).toThrow(new TypeError(ERROR_MESSAGES.OPTS_FIELD_TYPE_MISMATCH + 'boolean and string'));
    expect(() => validateInput('X:1\nK:C\nCDEF|]', 3, validOptsFloatingPointFields)).toThrow(new TypeError(ERROR_MESSAGES.OPTS_FIELD_TYPE_MISMATCH + 'non-integer and non-integer'));
    expect(() => validateInput('X:1\nK:C\nCDEF|]', 3, validOptsInvalidFieldValues)).toThrow(new RangeError(ERROR_MESSAGES.OPTS_FIELD_TYPE_MISMATCH + '60 and -60'));
    expect(validateInput('X:1\nK:C\nCDEF|]', 3, validOptsValidFields)).toBe(undefined);
});