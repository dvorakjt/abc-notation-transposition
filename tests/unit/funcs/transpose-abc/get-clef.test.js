const {getClef} = require('../../../../functions/transpose-abc');

test('Expect getClef to return null if there is no match.', () => {
    const testField1 = 'K: C major transpose=-2';
    expect(getClef(testField1)).toBe(null);

    const testField2 = 'K: none clef= ';
    expect(getClef(testField2)).toBe(null);
});

test('Expect getClef to return treble, treble-8, treble+8, alto, tenor, bass and perc', () => {
    const treble = 'V:AltoSaxophone clef=treble';
    expect(getClef(treble)).toBe('treble');

    const trebleMinus8 = 'K: Dmin clef= treble-8';
    expect(getClef(trebleMinus8)).toBe('treble-8');

    const treblePlus8 = 'V:VoiceName treble+8';
    expect(getClef(treblePlus8)).toBe('treble+8');

    const alto = 'K:Ephr alto';
    expect(getClef(alto)).toBe('alto');

    const tenor = 'K: A   aeolian clef=tenor';
    expect(getClef(tenor)).toBe('tenor');

    const bass = 'K: C# mix bass';
    expect(getClef(bass)).toBe('bass');

    const perc = 'V:SnareDrum clef=perc';
    expect(getClef(perc)).toBe('perc');
});