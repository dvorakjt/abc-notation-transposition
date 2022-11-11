const {transposeABC, ACCIDENTAL_NUMBER_PREFERENCES, SHARPS_OR_FLATS_PREFERENCES} = require('../../index');

test('Expect transposeABC to transpose F major to Gb major when SHARPS_OR_FLATS_PREFERENCES.PRESERVE_ORIGINAL is passed as an option.', () => {
    const abcNotation = "X:1\nM:C\nL:1/4\nK:Fmaj\nFGAB|cdef]";
    const  preserveOriginal = {
        accidentalNumberPreference:  ACCIDENTAL_NUMBER_PREFERENCES.PREFER_FEWER,
        preferSharpsOrFlats:  SHARPS_OR_FLATS_PREFERENCES.PRESERVE_ORIGINAL
    }

    const transposedToGFlatMajor = transposeABC(abcNotation, 1, preserveOriginal);

    expect(transposedToGFlatMajor).toBe("X:1\nM:C\nL:1/4\nK:Gbmajor\nGABc|defg]")

});

test('Expect transposeABC to transpose G major to F# major when SHARPS_OR_FLATS_PREFERENCES.PRESERVE_ORIGINAL is passed as an option.', () => {
    const abcNotation = "X:1\nM:C\nL:1/4\nK:Gmaj\nGABc|defg]";
    const  preserveOriginal = {
        accidentalNumberPreference:  ACCIDENTAL_NUMBER_PREFERENCES.PREFER_FEWER,
        preferSharpsOrFlats:  SHARPS_OR_FLATS_PREFERENCES.PRESERVE_ORIGINAL
    }

    const transposedToFSharpMajor = transposeABC(abcNotation, -1, preserveOriginal);

    expect(transposedToFSharpMajor).toBe("X:1\nM:C\nL:1/4\nK:F#major\nFGAB|cdef]")

});