const {isUpperCase, includesIgnoreCase} = require('../../../../functions/string-utils');

test('Expect isUpperCase to return true for an uppercase String.', () => {
    expect(isUpperCase("TESTING")).toBe(true);
});

test('Expect isUpperCase to return false for a string that includes lowercase letters', () => {
    expect(isUpperCase("This should be false.")).toBe(false);
});

test('Expect includesIgnoreCase to return true for a string which includes a substring', () => {
    expect(includesIgnoreCase('This is a large string', 'STRING')).toBe(true);
});

test('Expect includesIgnoreCase to return false for a string which does not include a substring', () => {
    expect(includesIgnoreCase('This is a large string', 'foo')).toBe(false);
})