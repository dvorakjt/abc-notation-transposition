const {transposePitch} = require('./functions/transpose-pitch');
const {KEYS} = require('./constants');

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
}

console.log(transposePitch('C', KEYS.get(0)[0], KEYS.get(2)[0], 'major', KEYS.get(0)[0].keySig, KEYS.get(2)[0].keySig, 2));