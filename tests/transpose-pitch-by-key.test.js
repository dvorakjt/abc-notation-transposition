const {transposePitch} = require('../functions/transpose-pitch');
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

const cmajorkey = {
    A: "=",
    B: "=",
    C: "=",
    D: "=",
    E: "=",
    F: "=",
    G: "="
};

const dmajorkey = {
    A: "=",
    B: "=",
    C: "^",
    D: "=",
    E: "=",
    F: "^",
    G: "="
};

const fmajorkey = {
    A: "=",
    B: "_",
    C: "=",
    D: "=",
    E: "=",
    F: "=",
    G: "="
};

//note that accidentals should only occur in the transposed note when it falls outside of the new key
//for example, 'C' transposes to 'D' in Db major because it is unnecessary to display a flat next to D
//as it is already modified by the flat in the key signature
test('Test note transpose', () => {
    console.log(transposePitch('__F', Cmajor, Fmajor, 'major', cmajorkey, fmajorkey, 5));
    expect(transposePitch('C', Cmajor, Dmajor, 'major', cmajorkey, dmajorkey, 2)).toBe('D');
});