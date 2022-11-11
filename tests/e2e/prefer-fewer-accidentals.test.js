const {transposeABC, ACCIDENTAL_NUMBER_PREFERENCES, SHARPS_OR_FLATS_PREFERENCES} = require('../../index');

test('Expect transposeABC to transpose C major to C flat major when ACCIDENTAL_NUMBER_PREFERENCES.PREFER_MORE is passed as an option.', () => {
    const abcNotation = "X:1\nM:C\nL:1/4\nK:Cmaj\nCDEF|GABc|]";
    const  preferMore = {
        accidentalNumberPreference:  ACCIDENTAL_NUMBER_PREFERENCES.PREFER_FEWER,
        preferSharpsOrFlats:  SHARPS_OR_FLATS_PREFERENCES.PRESERVE_ORIGINAL
    }

    const transposedToBMajor = transposeABC(abcNotation, -1, preferMore);

    expect(transposedToBMajor).toBe("X:1\nM:C\nL:1/4\nK:Bmajor\nB,CDE|FGAB|]")

});