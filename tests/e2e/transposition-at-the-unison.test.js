const {transposeABC, INTERVALS, ACCIDENTAL_NUMBER_PREFERENCES, SHARPS_OR_FLATS_PREFERENCES} = require('../../index');

test('Expect a melody in C major to transpose to the same melody when transposed at the unison.', () => {
    const CMajor = "X:1\nM:C\nL:1/4\nK:Cmajor\nCDEF|^FGAB|cB_BA|GFED|C4|]";
    expect(transposeABC(CMajor, INTERVALS.UNISON)).toBe(CMajor);
});

test('Expect a melody in Cb major to transpose to B major when transposed at the unison with default opts.', () => {
    const CbMajor = "X:1\nM:C\nL:1/4\nK:Cbmajor\nCDEF|GABc|]";
    const BMajor = "X:1\nM:C\nL:1/4\nK:Bmajor\nB,CDE|FGAB|]";
    expect(transposeABC(CbMajor, INTERVALS.UNISON)).toBe(BMajor);
});

test('Expect a melody in B major to transpose to Cb major when transposed at the unison with opts which prefer flats.', () => {
    const BMajor = "X:1\nM:C\nL:1/4\nK:Bmajor\nB,CDE|FGAB|]";
    const CbMajor = "X:1\nM:C\nL:1/4\nK:Cbmajor\nCDEF|GABc|]";
    
    const  preferFlats = {
        accidentalNumberPreference:  ACCIDENTAL_NUMBER_PREFERENCES.NO_PREFERENCE,
        preferSharpsOrFlats:  SHARPS_OR_FLATS_PREFERENCES.PREFER_FLATS
    }

    expect(transposeABC(BMajor, INTERVALS.UNISON, preferFlats)).toBe(CbMajor);
});

test('Expect a melody in Gb major to transpose to G# major when transposed at the unison with opts which prefer sharps.', () => {
    const GbMajor = "X:1\nM:C\nL:1/4\nK:Gbmajor\nGABc|defg]";
    const FSharpMajor = "X:1\nM:C\nL:1/4\nK:F#major\nFGAB|cdef]";

    const  preferSharps = {
        accidentalNumberPreference:  ACCIDENTAL_NUMBER_PREFERENCES.NO_PREFERENCE,
        preferSharpsOrFlats:  SHARPS_OR_FLATS_PREFERENCES.PREFER_SHARPS
    }

    expect(transposeABC(GbMajor, INTERVALS.UNISON, preferSharps)).toBe(FSharpMajor);
});

test('Expect a melody in F# major to transpose to Gb major when transposed at the unison with opts which prefer flats.', () => {
    const FSharpMajor = "X:1\nM:C\nL:1/4\nK:F#major\nFGAB|cdef]";
    const GbMajor = "X:1\nM:C\nL:1/4\nK:Gbmajor\nGABc|defg]";
    
    const  preferFlats = {
        accidentalNumberPreference:  ACCIDENTAL_NUMBER_PREFERENCES.NO_PREFERENCE,
        preferSharpsOrFlats:  SHARPS_OR_FLATS_PREFERENCES.PREFER_FLATS
    }

    expect(transposeABC(FSharpMajor, INTERVALS.UNISON, preferFlats)).toBe(GbMajor);
});