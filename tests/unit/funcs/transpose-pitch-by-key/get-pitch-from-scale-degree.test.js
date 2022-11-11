const {getPitchLetterFromScaleDegree} = require('../../../../functions/transpose-pitch-by-key');

//scale degree is zero-indexed
test('Expect getPitchLetterFromScaleDegree to correctly return a pitch letter.', () => {
    expect(getPitchLetterFromScaleDegree(2, 'C')).toBe('E');
});

test('Expect getPitchLetterFromScaleDegree to throw an error if incorrect parameters are provided.', () => {
    expect(() => getPitchLetterFromScaleDegree("Not a number", 'C')).toThrow(new Error("scaleDegree should be a number between 0 and 6 (inclusive)"));
    expect(() => getPitchLetterFromScaleDegree(3, 'Not a letter')).toThrow(new Error("keyLetter must be a capital letter between A and G"));
});
