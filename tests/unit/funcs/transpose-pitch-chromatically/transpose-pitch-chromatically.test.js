const {transposePitchChromatically} = require('../../../../functions/tranpose-pitch-chromatically');
const {INTERVALS} = require('../../../../constants');

test('Expect transposePitchChromatically to yield expected transpositions.', () => {
    const voiceState = {
        originalKey : 'none',
        mode : undefined,
        transposedKey : 'none',
        originalAccidentals : {
            A: '=',
            B: '=',
            C: '=',
            D: '=',
            E: '=',
            F: '=',
            G: '='
        },
        transposedAccidentals : {
            A: '=',
            B: '=',
            C: '=',
            D: '=',
            E: '=',
            F: '=',
            G: '='
        },
        clef : 'treble'
    }
    expect(transposePitchChromatically('=c', voiceState, INTERVALS.ASCENDING.MINOR_SECOND)).toBe('^c');
});

test('Expect transposePitchChromatically to yield expected transpositions.', () => {
    const voiceState = {
        originalKey : 'none',
        mode : undefined,
        transposedKey : 'none',
        originalAccidentals : {
            A: '=',
            B: '=',
            C: '=',
            D: '=',
            E: '=',
            F: '=',
            G: '='
        },
        transposedAccidentals : {
            A: '=',
            B: '=',
            C: '=',
            D: '=',
            E: '=',
            F: '=',
            G: '='
        },
        clef : 'treble'
    }
    expect(transposePitchChromatically('_B', voiceState, INTERVALS.DESCENDING.MAJOR_SECOND)).toBe('_A');
});

test('Expect transposePitchChromatically to yield expected transpositions.', () => {
    const voiceState = {
        originalKey : 'none',
        mode : undefined,
        transposedKey : 'none',
        originalAccidentals : {
            A: '=',
            B: '=',
            C: '=',
            D: '=',
            E: '=',
            F: '=',
            G: '='
        },
        transposedAccidentals : {
            A: '=',
            B: '=',
            C: '=',
            D: '=',
            E: '=',
            F: '=',
            G: '='
        },
        clef : 'treble'
    }
    expect(transposePitchChromatically('^c', voiceState, INTERVALS.ASCENDING.MAJOR_SECOND)).toBe('^d');
});

test('Expect transposePitchChromatically to yield expected transpositions.', () => {
    const voiceState = {
        originalKey : 'none',
        mode : undefined,
        transposedKey : 'none',
        originalAccidentals : {
            A: '=',
            B: '=',
            C: '=',
            D: '=',
            E: '=',
            F: '=',
            G: '='
        },
        transposedAccidentals : {
            A: '=',
            B: '=',
            C: '=',
            D: '=',
            E: '=',
            F: '=',
            G: '='
        },
        clef : 'treble'
    }
    expect(transposePitchChromatically('__A,', voiceState, INTERVALS.DESCENDING.MINOR_SECOND)).toBe('_G,');
});

test('Expect transposePitchChromatically to yield expected transpositions.', () => {
    const voiceState = {
        originalKey : 'none',
        mode : undefined,
        transposedKey : 'none',
        originalAccidentals : {
            A: '=',
            B: '=',
            C: '=',
            D: '=',
            E: '=',
            F: '=',
            G: '='
        },
        transposedAccidentals : {
            A: '=',
            B: '=',
            C: '=',
            D: '=',
            E: '=',
            F: '=',
            G: '='
        },
        clef : 'treble'
    }
    expect(transposePitchChromatically('^^G', voiceState, INTERVALS.DESCENDING.MINOR_SECOND)).toBe('^G');
});

test('Expect transposePitchChromatically to yield expected transpositions.', () => {
    const voiceState = {
        originalKey : 'none',
        mode : undefined,
        transposedKey : 'none',
        originalAccidentals : {
            A: '=',
            B: '=',
            C: '=',
            D: '=',
            E: '=',
            F: '=',
            G: '='
        },
        transposedAccidentals : {
            A: '=',
            B: '=',
            C: '=',
            D: '=',
            E: '=',
            F: '=',
            G: '='
        },
        clef : 'treble'
    }
    expect(transposePitchChromatically('_D', voiceState, INTERVALS.UNISON)).toBe('_D');
});

test('Expect transposePitchChromatically to yield expected transpositions.', () => {
    const voiceState = {
        originalKey : 'none',
        mode : undefined,
        transposedKey : 'none',
        originalAccidentals : {
            A: '=',
            B: '=',
            C: '=',
            D: '=',
            E: '=',
            F: '=',
            G: '='
        },
        transposedAccidentals : {
            A: '=',
            B: '=',
            C: '=',
            D: '=',
            E: '=',
            F: '=',
            G: '='
        },
        clef : 'treble'
    }
    expect(transposePitchChromatically('__D', voiceState, INTERVALS.UNISON)).toBe('C');
});

test('Expect transposePitchChromatically to yield expected transpositions.', () => {
    const voiceState = {
        originalKey : 'none',
        mode : undefined,
        transposedKey : 'none',
        originalAccidentals : {
            A: '=',
            B: '=',
            C: '=',
            D: '=',
            E: '=',
            F: '=',
            G: '='
        },
        transposedAccidentals : {
            A: '=',
            B: '=',
            C: '=',
            D: '=',
            E: '_', //Note that there was an e flat previously
            F: '=',
            G: '='
        },
        clef : 'treble'
    }
    expect(transposePitchChromatically('E', voiceState, INTERVALS.DESCENDING.MINOR_SECOND)).toBe('E');
});