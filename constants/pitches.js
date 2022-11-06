const { SimpleCircularArray } = require('../classes/SimpleCircularArray');

module.exports.DIATONIC_PITCHES = new SimpleCircularArray(["A", "B", "C", "D", "E", "F", "G"]);

module.exports.ENHARMONIC_PITCHES = new SimpleCircularArray([
    ["=C", "^B", "__D"],
    ["^C", "_D", "^^B"],
    ["=D", "__E", "^^C"],
    ["_E", "^D", "__F"],
    ["=E", "_F", "^^D"],
    ["=F", "^E", "__G"],
    ["^F", "_G", "^^E",],
    ["=G", "__A", "^^F"],
    ["_A", "^G"],
    ["=A", "__B", "^^G"],
    ["_B", "^A", "__C"],
    ["=B", "_C", "^^A"]
]);