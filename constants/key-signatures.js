const { SimpleCircularArray } = require('../classes/SimpleCircularArray');
const { ACCIDENTALS } = require("./constants");
//find the index of the array containing the name of the key
//move through the array until the requisite number of half steps have been accounted for
module.exports.KEYS = new SimpleCircularArray([
    [ 
        {
            major: "C",
            minor: "A",
            dorian: "D",
            phrygian: "E",
            lydian: "F",
            mixolydian: "G",
            locrian: "B",
            numOfAccidentals: 0,
            contains: ACCIDENTALS.NONE,
            keySig: {
                A: "",
                B: "",
                C: "",
                D: "",
                E: "",
                F: "",
                G: ""
            }
        },
    ],
    [
        {
            major: "C#",
            minor: "A#",
            dorian: "D#",
            phrygian: "E#",
            lydian: "F#",
            mixolydian: "G#",
            locrian: "B#",
            numOfAccidentals: 7,
            contains: ACCIDENTALS.SHARPS,
            keySig: {
                A: "^",
                B: "^",
                C: "^",
                D: "^",
                E: "^",
                F: "^",
                G: "^"
            }
        },
        {
            major: "Db",
            minor: "Bb",
            dorian: "Eb",
            phrygian: "F",
            lydian: "Gb",
            mixolydian: "Ab",
            locrian: "C",
            numOfAccidentals: 5,
            contains: ACCIDENTALS.FLATS,
            keySig: {
                A: "_",
                B: "_",
                C: "",
                D: "_",
                E: "_",
                F: "",
                G: "_"
            }
        },
    ],
    [
        {
            major: "D",
            minor: "B",
            dorian: "E",
            phrygian: "F#",
            lydian: "G",
            mixolydian: "A",
            locrian: "C#",
            numOfAccidentals: 2,
            contains: ACCIDENTALS.SHARPS,
            keySig: {
                A: "",
                B: "",
                C: "^",
                D: "",
                E: "",
                F: "^",
                G: ""
            }
        },
    ],
    [
        {
            major: "Eb",
            minor: "C",
            dorian: "F",
            phrygian: "G",
            lydian: "Ab",
            mixolydian: "Bb",
            locrian: "D",
            numOfAccidentals: 3,
            contains: ACCIDENTALS.FLATS,
            keySig: {
                A: "_",
                B: "_",
                C: "",
                D: "",
                E: "_",
                F: "",
                G: ""
            }
        },
    ],
    [ 
        {
            major: "E",
            minor: "C#",
            dorian: "F#",
            phrygian: "G#",
            lydian: "A",
            mixolydian: "B",
            locrian: "D#",
            numOfAccidentals: 0,
            contains: ACCIDENTALS.SHARPS,
            keySig: {
                A: "",
                B: "",
                C: "^",
                D: "^",
                E: "",
                F: "^",
                G: "^"
            }
        },
    ],
    [ 
        {
            major: "F",
            minor: "D",
            dorian: "G",
            phrygian: "A",
            lydian: "Bb",
            mixolydian: "C",
            locrian: "E",
            numOfAccidentals: 1,
            contains: ACCIDENTALS.FLATS,
            keySig: {
                A: "",
                B: "_",
                C: "",
                D: "",
                E: "",
                F: "",
                G: ""
            }
        },
    ],
    [ 
        {
            major: "F#",
            minor: "D#",
            dorian: "G#",
            phrygian: "A#",
            lydian: "B",
            mixolydian: "C#",
            locrian: "E#",
            numOfAccidentals: 6,
            contains: ACCIDENTALS.SHARPS,
            keySig: {
                A: "^",
                B: "",
                C: "^",
                D: "^",
                E: "^",
                F: "^",
                G: "^"
            }
        },
        {
            major: "Gb",
            minor: "Eb",
            dorian: "Ab",
            phrygian: "Bb",
            lydian: "Cb",
            mixolydian: "Db",
            locrian: "F",
            numOfAccidentals: 6,
            contains: ACCIDENTALS.FLATS,
            keySig: {
                A: "_",
                B: "_",
                C: "_",
                D: "_",
                E: "_",
                F: "",
                G: "_"
            }
        },
    ],
    [ 
        {
            major: "G",
            minor: "E",
            dorian: "A",
            phrygian: "B",
            lydian: "C",
            mixolydian: "D",
            locrian: "F#",
            numOfAccidentals: 1,
            contains: ACCIDENTALS.SHARPS,
            keySig: {
                A: "",
                B: "",
                C: "",
                D: "",
                E: "",
                F: "^",
                G: ""
            }
        },
    ],
    [ 
        {
            major: "Ab",
            minor: "F",
            dorian: "Bb",
            phrygian: "C",
            lydian: "Db",
            mixolydian: "Eb",
            locrian: "G",
            numOfAccidentals: 0,
            contains: ACCIDENTALS.NONE,
            keySig: {
                A: "_",
                B: "_",
                C: "",
                D: "_",
                E: "_",
                F: "",
                G: ""
            }
        },
    ],
    [ 
        {
            major: "A",
            minor: "F#",
            dorian: "B",
            phrygian: "C#",
            lydian: "D",
            mixolydian: "E",
            locrian: "G#",
            numOfAccidentals: 3,
            contains: ACCIDENTALS.SHARPS,
            keySig: {
                A: "",
                B: "",
                C: "^",
                D: "",
                E: "",
                F: "^",
                G: "^"
            }
        },
    ],
    [ 
        {
            major: "Bb",
            minor: "G",
            dorian: "C",
            phrygian: "D",
            lydian: "Eb",
            mixolydian: "F",
            locrian: "A",
            numOfAccidentals: 2,
            contains: ACCIDENTALS.FLATS,
            keySig: {
                A: "",
                B: "_",
                C: "",
                D: "",
                E: "_",
                F: "",
                G: ""
            }
        },
    ],
    [ 
        {
            major: "B",
            minor: "G#",
            dorian: "C#",
            phrygian: "D#",
            lydian: "E",
            mixolydian: "F#",
            locrian: "A#",
            numOfAccidentals: 5,
            contains: ACCIDENTALS.SHARPS,
            keySig: {
                A: "^",
                B: "",
                C: "^",
                D: "^",
                E: "",
                F: "^",
                G: "^"
            }
        },
        {
            major: "Cb",
            minor: "Ab",
            dorian: "Db",
            phrygian: "Eb",
            lydian: "Fb",
            mixolydian: "Gb",
            locrian: "Bb",
            numOfAccidentals: 7,
            contains: ACCIDENTALS.FLATS,
            keySig: {
                A: "_",
                B: "_",
                C: "_",
                D: "_",
                E: "_",
                F: "_",
                G: "_"
            }
        },
    ],
]);