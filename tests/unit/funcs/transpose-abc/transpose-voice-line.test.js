const {transposeVoiceLine} = require('../../../../functions/transpose-abc');
const {KEYS} = require('../../../../constants');

test('Expect transposeVoiceLine to transpose voice to return an empty string when passed an empty string.', () => {
    expect(transposeVoiceLine('', {}, 999)).toBe('');
});

test('Expect transposeVoiceLine to return the passed string if it is a comment line or an instruction.', () => {
    const commentLine = '% this is a comment\n';
    const instructionLine = '%% this is an instruction\n';
    expect(transposeVoiceLine(commentLine, {}, 999)).toBe(commentLine);
    expect(transposeVoiceLine(instructionLine, {}, -999)).toBe(instructionLine);
});

test('Expect transposeVoiceLine to return the passed string if it is a continuation of a field line.', () => {
    const continuationLine = '+ more information about a field';
    expect(transposeVoiceLine(continuationLine, {}, -999)).toBe(continuationLine);
});

test('Expect transposeVoiceLine to return the passed string if it is a V: field line', () => {
    const vFieldLine = 'V: VoiceName clef=treble';
    const vInlineField = '[V: VoiceName2]';
    const voiceState = {
        originalKey : KEYS.get(0)[0],
        mode : 'major',
        transposedKey : KEYS.get(2)[0],
        originalAccidentals : Object.assign({}, KEYS.get(0)[0].keySig),
        transposedAccidentals : Object.assign({}, KEYS.get(2)[0].keySig),
        clef : 'treble'
    }
    expect(transposeVoiceLine(vFieldLine, voiceState, 2)).toBe(vFieldLine);
    expect(transposeVoiceLine(vInlineField, voiceState, 2)).toBe(vInlineField);
});

test('Expect transposeVoiceLine to change the clef if it detects a new clef in a voice field.', () => {
    const vFieldLine = 'V: VoiceName clef=treble';
    const voiceState = {
        originalKey : KEYS.get(0)[0],
        mode : 'major',
        transposedKey : KEYS.get(2)[0],
        originalAccidentals : Object.assign({}, KEYS.get(0)[0].keySig),
        transposedAccidentals : Object.assign({}, KEYS.get(2)[0].keySig),
        clef : 'bass'
    }
    transposeVoiceLine(vFieldLine, voiceState, 2);
    expect(voiceState.clef).toBe('treble');
});

test('Expect transposeVoiceLine to change the clef if it detects a new clef in a key field.', () => {
    const keyFieldField = '[K:C treble]';
    const voiceState = {
        originalKey : KEYS.get(0)[0],
        mode : 'major',
        transposedKey : KEYS.get(2)[0],
        originalAccidentals : Object.assign({}, KEYS.get(0)[0].keySig),
        transposedAccidentals : Object.assign({}, KEYS.get(2)[0].keySig),
        clef : 'bass'
    }
    transposeVoiceLine(keyFieldField, voiceState, 2);
    expect(voiceState.clef).toBe('treble');
});

test('Expect transposeVoiceLine to return a transposed key line.', () => {
    const CMAJOR = KEYS.get(0)[0];
    const DMAJOR = KEYS.get(2)[0];
    const EMAJOR = KEYS.get(4)[0];
    const keyFieldField = '[K:D]';
    const voiceState = {
        originalKey : CMAJOR,
        mode : 'major',
        transposedKey : DMAJOR,
        originalAccidentals : Object.assign({}, CMAJOR.keySig),
        transposedAccidentals : Object.assign({}, DMAJOR.keySig),
        clef : 'treble'
    }
    expect(transposeVoiceLine(keyFieldField, voiceState, 2)).toBe('[K:Emajor]');
    expect(voiceState.originalKey).toEqual(DMAJOR);
    expect(voiceState.transposedKey).toEqual(EMAJOR);
    expect(voiceState.originalAccidentals).toEqual(DMAJOR.keySig);
    expect(voiceState.transposedAccidentals).toEqual(EMAJOR.keySig);
});

test('Expect transposeVoiceLine to return the passed string if it is any other type of field.', () => {
    expect(transposeVoiceLine('[r:this is a remark]', {}, 100)).toBe('[r:this is a remark]');
});

test('Expect transposeVoiceLine to return the passed string if it is a new measure and to reset the accidentals to those of the key.', () => {
    const CMAJOR = KEYS.get(0)[0];
    const DMAJOR = KEYS.get(2)[0];
    const voiceState = {
        originalKey : CMAJOR,
        mode : 'major',
        transposedKey : DMAJOR,
        originalAccidentals : Object.assign({}, CMAJOR.keySig),
        transposedAccidentals : Object.assign({}, DMAJOR.keySig),
        clef : 'treble'
    }
    voiceState.originalAccidentals.G = '^';
    voiceState.transposedAccidentals.A = '^';
    expect(transposeVoiceLine('|', voiceState, 2)).toBe('|');
    expect(voiceState.originalAccidentals.G).toBe('=');
    expect(voiceState.transposedAccidentals.A).toBe('=');
});

test('Expect transposeVoiceLine to return the passed string if the key is HP or Hp or the clef is perc', () => { 
    const CMAJOR = KEYS.get(0)[0];
    const DMAJOR = KEYS.get(2)[0];

    const notes = 'ABCD|EFGA\]';

    const voiceState = {
        originalKey : 'HP',
        mode : undefined,
        transposedKey : 'HP',
        originalAccidentals : Object.assign({}, CMAJOR.keySig),
        transposedAccidentals : Object.assign({}, CMAJOR.keySig),
        clef : 'treble'
    }
    expect(transposeVoiceLine(notes, voiceState, 2)).toBe(notes);

    voiceState.key = 'Hp';
    voiceState.transposedKey = 'Hp';

    expect(transposeVoiceLine(notes, voiceState, 2)).toBe(notes);

    voiceState.key = CMAJOR;
    voiceState.transposedKey = DMAJOR;
    voiceState.transposedAccidentals = Object.assign({}, DMAJOR.keySig);
    voiceState.clef = 'perc';

    expect(transposeVoiceLine(notes, voiceState, 2)).toBe(notes);
});

test('Expect a key of none or "" to return chromatically transposed pitches.', () => {
    const ATONAL = KEYS.get(0)[0];
    const voiceState = {
        originalKey : 'none',
        mode : undefined,
        transposedKey : 'none',
        originalAccidentals : Object.assign({}, ATONAL.keySig),
        transposedAccidentals : Object.assign({}, ATONAL.keySig),
        clef : 'treble'
    }

    const notes = 'C^CD^D|EF^FG|^GA^AB|cB_BA|_AG_GF|E_ED_D|C4|]';

    expect(transposeVoiceLine(notes, voiceState, 1)).toBe("^CD^DE|F^FG^G|A^ABc|^c=cB^A|A^G=G^F|FE^D=D|^C4|]");
});

test('Expect a voiceLine of notes and a voiceState with a transposable key and clef to yield a correctly transposed line.', () => {
    const CMAJOR = KEYS.get(0)[0];
    const EMAJOR = KEYS.get(4)[0];
    const voiceState = {
        originalKey : CMAJOR,
        mode : 'major',
        transposedKey : EMAJOR,
        originalAccidentals : Object.assign({}, CMAJOR.keySig),
        transposedAccidentals : Object.assign({}, EMAJOR.keySig),
        clef : 'treble'
    }
    const notes = 'CD^DE|FGAB|cB_BA|GFED|C4|]';
    const transposed = 'EF^^FG|ABcd|ed=dc|BAGF|E4|]';
    expect(transposeVoiceLine(notes, voiceState, 4)).toBe(transposed);
});

test('Expect a transposable voiceLine to ignore comments and symbols.', () => {
    const CMAJOR = KEYS.get(0)[0];
    const EMAJOR = KEYS.get(4)[0];
    const voiceState = {
        originalKey : CMAJOR,
        mode : 'major',
        transposedKey : EMAJOR,
        originalAccidentals : Object.assign({}, CMAJOR.keySig),
        transposedAccidentals : Object.assign({}, EMAJOR.keySig),
        clef : 'treble'
    }
    const notes = '!ignore this! CD^DE|FGAB|cB_BA|GFED|C4|] % ignore this\n';
    const transposed = '!ignore this! EF^^FG|ABcd|ed=dc|BAGF|E4|] % ignore this\n';
    expect(transposeVoiceLine(notes, voiceState, 4)).toBe(transposed);
});