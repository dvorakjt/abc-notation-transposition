const { SimpleCircularArray } = require('../classes/SimpleCircularArray');

module.exports.DIATONIC_PITCHES = new SimpleCircularArray(["A", "B", "C", "D", "E", "F", "G"]);

module.exports.ENHARMONIC_PITCHES = new SimpleCircularArray([
    ["^B", "C", "__D"],
    ["^^B", "^C", "_D"],
    ["^^C", "D", "__E"],
    ["^D", "_E", "__F"],
    ["^^D", "E", "_F"],
    ["^E", "F", "__G"],
    ["^^E", "^F", "_G"],
    ["^^F", "G", "__A"],
    ["^G", "_A"],
    ["^^G", "A", "__B"],
    ["^A", "_B", "__C"],
    ["^^A", "B", "_C"]
]);