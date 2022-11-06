const {transposePitchByKey} = require('../functions/transpose-pitch-by-key');
const {KEYS} = require('../constants');

const Cmajor = KEYS.get(0)[0];
const Dbmajor = KEYS.get(1).find(key => key.major === 'Db');
const Dmajor = KEYS.get(2)[0];
const Ebmajor = KEYS.get(3)[0];
const Emajor = KEYS.get(4)[0];
const Fmajor = KEYS.get(5)[0];
const Gbmajor = KEYS.get(6).find(key => key.major === 'Gb');
const Gmajor = KEYS.get(7)[0];
const Abmajor = KEYS.get(8)[0];
const Amajor = KEYS.get(9)[0];
const Bbmajor = KEYS.get(10)[0];
const Bmajor = KEYS.get(11).find(key => key.major === 'B');

//note that accidentals should only occur in the transposed note when it falls outside of the new key
//for example, 'C' transposes to 'D' in Db major because it is unnecessary to display a flat next to D
//as it is already modified by the flat in the key signature
test('Expect natural, sharp, and flat notes to transpose upwards correctly within one octave.', () => {
    expect(transposePitchByKey(Cmajor, Dbmajor, 'major', 1, 'C')).toBe('D');
    expect(transposePitchByKey(Cmajor, Dbmajor, 'major', 1, '=C')).toBe('_D');
    expect(transposePitchByKey(Dbmajor, Dmajor, 'major', 1, 'E')).toBe('E');
    expect(transposePitchByKey(Dbmajor, Dmajor, 'major', 1, '_E')).toBe('=E');
    expect(transposePitchByKey(Dmajor, Ebmajor, 'major', 1, '^G')).toBe('=A');
    expect(transposePitchByKey(Ebmajor, Emajor, 'major', 1, "_D")).toBe('=D');
    expect(transposePitchByKey(Emajor, Fmajor, 'major', 1, '^A')).toBe('=B');
    expect(transposePitchByKey(Fmajor, Gbmajor, 'major', 1, '_E')).toBe('_F');
    expect(transposePitchByKey(Gbmajor, Gmajor, 'major', 1, '_F')).toBe('=F');
    expect(transposePitchByKey(Gmajor, Abmajor, 'major', 1, '^C')).toBe('=D');
    expect(transposePitchByKey(Abmajor, Amajor, 'major', 1, 'A')).toBe('A');
    expect(transposePitchByKey(Amajor, Bbmajor, 'major', 1, '_B')).toBe('_c');
});