const {transposeABC, ACCIDENTAL_NUMBER_PREFERENCES, SHARPS_OR_FLATS_PREFERENCES} = require('../../index');

test('Expect transposeABC to transpose C major to C flat major when ACCIDENTAL_NUMBER_PREFERENCES.PREFER_MORE is passed as an option.', () => {
    const abcNotation = "X:1\nM:C\nL:1/4\nK:Cmaj\nCDEF|GABc|]";
    const  preferMore = {
        accidentalNumberPreference:  ACCIDENTAL_NUMBER_PREFERENCES.PREFER_MORE,
        preferSharpsOrFlats:  SHARPS_OR_FLATS_PREFERENCES.PRESERVE_ORIGINAL
    }

    const transposedToCFlatMajor = transposeABC(abcNotation, -1, preferMore);

    expect(transposedToCFlatMajor).toBe("X:1\nM:C\nL:1/4\nK:Cbmajor\nCDEF|GABc|]")

});
    