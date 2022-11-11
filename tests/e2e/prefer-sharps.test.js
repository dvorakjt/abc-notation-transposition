const {transposeABC, ACCIDENTAL_NUMBER_PREFERENCES, SHARPS_OR_FLATS_PREFERENCES} = require('../../index');

test('Expect transposeABC to transpose C major to C# major when SHARPS_OR_FLATS_PREFERENCES.PREFER_SHARPS is passed as an option.', () => {
    const abcNotation = "X:1\nM:C\nL:1/4\nK:Cmaj\nCDEF|GABc|]";
    const  preferSharps = {
        accidentalNumberPreference:  ACCIDENTAL_NUMBER_PREFERENCES.NO_PREFERENCE,
        preferSharpsOrFlats:  SHARPS_OR_FLATS_PREFERENCES.PREFER_SHARPS
    }

    const transposedToCFlatMajor = transposeABC(abcNotation, 1, preferSharps);

    expect(transposedToCFlatMajor).toBe("X:1\nM:C\nL:1/4\nK:C#major\nCDEF|GABc|]")

});