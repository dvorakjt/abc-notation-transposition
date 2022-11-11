const {getScaleDegreeFromPitchLetter} = require('../../../../functions/transpose-pitch-by-key');

//scale degree is zero-indexed
test('Expect getScaleDegreeFromPitchLetter to correctly return a scale degree.', () => {
    expect(getScaleDegreeFromPitchLetter('A', 'C')).toBe(5);
});

test('Expect getScaleDegreeFromPitchLetter to throw an error if incorrect parameters are provided.', () => {
    expect(() => getScaleDegreeFromPitchLetter('Not a letter', 'Not a letter')).toThrow(new Error("pitchLetter and keyLetter must be capital letters between A and G"));
});