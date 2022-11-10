# abc-notation-transposition
A robust utility for transposing abc notation strings by any number of half steps. Capable of intelligently handling multiple voices, inline key changes, atonality, and more. 

## About

### Abc notation

Abc notation is text-based music notation code developed by Chris Walshaw which can be interpreted by software and rendered as sheet music.

This module takes in a string in valid abc syntax and an integer number of half steps (positive for ascending, negative for descending) and returns a new abc string transposed by that amount.

### Abc syntax

The module expects to receive a valid abc notation string, so for more information on abc syntax, please visit Chris Walshaw's guide: [https://abcnotation.com/wiki/abc:standard:v2.1](https://abcnotation.com/wiki/abc:standard:v2.1)

### Use and testing

Transposed strings could be passed to Paul Rosen's [abcjs](https://www.npmjs.com/package/abcjs) module to render them in the browser. It is important to note that abcjs comes with a built-in transposition function, but that this module could be useful for transposition of abc notation strings prior to rendering them, or if you want to transpose them without rendering them (for instance, using this module in combination with the fs module to write transposed abc to a  .abc file).

[EasyABC](https://easyabc.sourceforge.net/) provides a great environment in which to test ABC notation: https://github.com/jwdj/EasyABC

## Use Cases

### Simplest Use Case

In this example, the module is used to transpose a simple ABC melody up by 2 half steps from C major to D major.

    //es6 module import
    import {transposeABC} from 'abc-notation-transposition';
        
    //commonJS require syntax
    //const {transposeABC} = require('abc-notation-transposition');
    
    //valid abc notation string
    const abcNotation = 
    `X:1
    M:C
    L:1/4
    K:C
    CDEF|GABC|]`;
    
    //wrap the transposition function in a try...catch block as it will 
    //throw an error if there is a syntax error in the abc notation string
    try {
       //transposes the original abc up by 2 half steps
       const transposedAbcNotation = transposeABC(abcNotation, 2);
    
       //do something with transposedAbcNotation
    
    } catch(e) {
       //handle errors here
       console.log(e.message);
    }
    
    //transposedAbcNotation will be: 
    //`X:1
    //M:C
    //L:1/4
    //K:Dmajor
    //DEFG|ABCD|]`

### Transposition by Named Intervals

The module provides constants representing different intervals for ease of use.

    //es6 module import
    import {transposeABC, INTERVALS} from  'abc-notation-transposition';
    
    //commonJS require syntax
    //const {transposeABC, INTERVALS} = require('abc-notation-transposition');
    
    //valid abc notation string
    const  abcNotation =
    "X:2\nM:C\nL:1/4\nK:C\nCDEF|GABC|]";
    
    try {
        //transposes the original abc by various intervals
        //Typically, you will want INTERVALS.ASCENDING.<INTERVAL_NAME> or
        //INTERVALS.DESCENDING.<INTERVAL_NAME>
        //For example, INTERVALS.ASCENDING.MINOR_SIXTH 
        //INTERVALS.UNISON corresponds to 0 half steps
        //Intervals can be multipied or added together

        const  upAMinorSecond = transposeABC(abcNotation, INTERVALS.ASCENDING.MINOR_SECOND);
        const  downAMajorThird = transposeABC(abcNotation, INTERVALS.DESCENDING.MAJOR_THIRD);
        const  upATritone = transposeABC(abcNotation, INTERVALS.ASCENDING.TRITONE);
        const  upAnOctave = transposeABC(abcNotation, INTERVALS.ASCENDING.OCTAVE);
        const  downTwoOctaves = transposeABC(abcNotation, INTERVALS.DESCENDING.OCTAVE * 2);
        const  upACompoundPerfectFifth = transposeABC(abcNotation, INTERVALS.ASCENDING.OCTAVE + INTERVALS.ASCENDING.PERFECT_FIFTH);
        
    } catch(e) {
        console.log(e.message);
    }
    
### Options

`transposeABC` accepts an optional opts parameter. The opts parameter allows you specify the transposition behavior when transposition could result in either of two keys. For example, transposition of a tune in C major by a tritone (6 half steps) could result in a tune in either Gb or F# major. Similarly, transposition of a tune in C major down by 1 half step could result in a tune in either B major or Cb major.

The opts parameter allows you to prefer keys with fewer accidentals, keys with more accidentals, sharp keys, flat keys, or either sharp or flat keys depending on the original key. The default behavior is to prefer fewer accidentals, and to prefer sharp or flat keys depending on the original key.

Note that for a key of "" or "none" (no key signature, i.e. atonal music), these options are not evaluated and the notation will be transposed chromatically according to different logic.

    //es6 module import syntax
    import {transposeABC, INTERVALS, ACCIDENTAL_NUMBER_PREFERENCES, SHARPS_OR_FLATS_PREFERENCES} from  'abc-notation-transposition';
    
    //commonJS require syntax
    //const {transposeABC, INTERVALS, ACCIDENTAL_NUMBER_PREFERENCES, SHARPS_OR_FLATS_PREFERENCES} = require('abc-notation-transposition');
   
    //valid abc notation string
    const  abcNotation =
    "X:1\nM:C\nL:1/4\nK:Cmaj\nCDEF|GABC|]";
    
    try {
    
        //opts defaults to this value when it is not provided:
        const  defaultOptions = {
            accidentalNumberPreference : ACCIDENTAL_NUMBER_PREFERENCES.PREFER_FEWER,
            preferSharpsOrFlats :  SHARPS_OR_FLATS_PREFERENCES.PRESERVE_ORIGINAL
        }
    
        //thus, this:
        const  transposedWithImplicitDefaultOptions = transposeABC(abcNotation, 1);
    
        //is equivalent to this:
        const  transposedWithExplicitDefaultOptions = transposeABC(abcNotation, 1, defaultOptions);
   
        //you can prefer more sharps or flats in the transposed key
        const  sadisticOptions = {
            accidentalNumberPreference:  ACCIDENTAL_NUMBER_PREFERENCES.PREFER_MORE,
            preferSharpsOrFlats:  SHARPS_OR_FLATS_PREFERENCES.PRESERVE_ORIGINAL
        }
    
        let  transposedToCFlatMajor = transposeABC(abcNotation, -1, sadisticOptions);
    
        //you can also set accidentalNumberPreference to no preference which will cause the
        //function to always select a key based on the sharps or flats preference
        //note that preferSharpsOrFlats is also evaluated when transposing to keys such as Gb major and F# major,
        //which have the same number of flats and sharps, respectively
    
        const  preferFlats = {
            accidentalNumberPreference:  ACCIDENTAL_NUMBER_PREFERENCES.NO_PREFERENCE,
            preferSharpsOrFlats:  SHARPS_OR_FLATS_PREFERENCES.PREFER_FLATS
        }
        
        const  preferSharps = {
            accidentalNumberPreference:  ACCIDENTAL_NUMBER_PREFERENCES.NO_PREFERENCE,
            preferSharpsOrFlats:  SHARPS_OR_FLATS_PREFERENCES.PREFER_SHARPS 
        }
    
        transposedToCFlatMajor = transposeABC(abcNotation, -1, preferFlats);
  
        const  transposedToCSharpMajor = transposeABC(abcNotation, 1, preferSharps);
    
        //an interesting use case for these options is to transpose music at the unison in order to change the key
        //to a more readable enharmonic key
    
        const  transposedToBMajor = transposeABC(transposedToCFlatMajor, INTERVALS.UNISON); //default options will prefer fewer accidentals
    
        const  transposedToDbMajor = transposeABC(transposedToCSharpMajor, INTERVALS.UNISON);
    
    } catch(e) {
        console.log(e.message);
    }

### Valid Key Signatures

### New Measures & Introduced Accidentals

### Multiple Voices

### Bagpipes and Percussion

### Common Gotchas
#### The backslash
Note that the backslash is valid abc notation symbol. In a JavaScript string, this represents an escape character, so it itself must be escaped with a second backslash.

### Putting it All Together

