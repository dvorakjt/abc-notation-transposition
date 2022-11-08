const {splitHeadKeyAndBody} = require('../../../../functions/transpose-abc');
const {ImproperlyFormattedABCNotationError} = require('../../../../classes');
const {ERROR_MESSAGES} = require('../../../../constants');

test('Expect splitHeadKeyAndBody to split a correctly formatted ABC string into 3 strings.', () => {
    const abcNotation = 'X:1\nK:A\nABCD|EFGA|]';
    expect(splitHeadKeyAndBody(abcNotation)).toEqual(['X:1\n', 'K:A', '\nABCD|EFGA|]']);
});

test('Expect splitHeadKeyAndBody to throw error when head is missing.', () => {
    const abcNotation = 'K:A\nABCD|EFGA|]';
    expect(() => splitHeadKeyAndBody(abcNotation)).toThrow(new ImproperlyFormattedABCNotationError(ERROR_MESSAGES.UNABLE_TO_SPLIT_HEAD_KEY_AND_BODY));
});

test('Expect splitHeadKeyAndBody to throw error when key is missing.', () => {
    const abcNotation = 'X:1\nABCD|EFGA|]';
    expect(() => splitHeadKeyAndBody(abcNotation)).toThrow(new ImproperlyFormattedABCNotationError(ERROR_MESSAGES.UNABLE_TO_SPLIT_HEAD_KEY_AND_BODY));
});

