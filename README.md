# abc-notation-transposition

![CI](https://github.com/dvorakjt/abc-notation-transposition/actions/workflows/run-tests.yml/badge.svg)

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
    "X:1\nM:C\nL:1/4\nK:C\nCDEF|GABc|]";
    
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
    //`X:1\nM:C\nL:1/4\nK:Dmajor\nDEFG|ABcd|]`

### Transposition by Named Intervals

The module provides constants representing different intervals for ease of use.

    //es6 module import
    import {transposeABC, INTERVALS} from  'abc-notation-transposition';
    
    //commonJS require syntax
    //const {transposeABC, INTERVALS} = require('abc-notation-transposition');
    
    //valid abc notation string
    const  abcNotation =
    "X:2\nM:C\nL:1/4\nK:C\nCDEF|GABc|]";
    
    try {
        //transposes the original abc by various intervals
        //Typically, you will want INTERVALS.ASCENDING.<INTERVAL_NAME> or
        //INTERVALS.DESCENDING.<INTERVAL_NAME>
        //For example, INTERVALS.ASCENDING.MINOR_SIXTH 
        //INTERVALS.UNISON corresponds to 0 half steps
        //Intervals can be multiplied or added together

        const upAMinorSecond = transposeABC(abcNotation, INTERVALS.ASCENDING.MINOR_SECOND);
        const downAMajorThird = transposeABC(abcNotation, INTERVALS.DESCENDING.MAJOR_THIRD);
        const upATritone = transposeABC(abcNotation, INTERVALS.ASCENDING.TRITONE);
        const upAnOctave = transposeABC(abcNotation, INTERVALS.ASCENDING.OCTAVE);
        const downTwoOctaves = transposeABC(abcNotation, INTERVALS.DESCENDING.OCTAVE * 2);
        const upACompoundPerfectFifth = transposeABC(abcNotation, INTERVALS.ASCENDING.OCTAVE + INTERVALS.ASCENDING.PERFECT_FIFTH);
        
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
    const abcNotation =
    "X:3\nM:C\nL:1/4\nK:Cmaj\nCDEF|GABc|]";
    
    try {
    
        //opts defaults to this value when it is not provided:
        const defaultOptions = {
            accidentalNumberPreference : ACCIDENTAL_NUMBER_PREFERENCES.PREFER_FEWER,
            preferSharpsOrFlats :  SHARPS_OR_FLATS_PREFERENCES.PRESERVE_ORIGINAL
        }
    
        //thus, this:
        const transposedWithImplicitDefaultOptions = transposeABC(abcNotation, 1);
    
        //is equivalent to this:
        const transposedWithExplicitDefaultOptions = transposeABC(abcNotation, 1, defaultOptions);
   
        //you can prefer more sharps or flats in the transposed key
        const sadisticOptions = {
            accidentalNumberPreference:  ACCIDENTAL_NUMBER_PREFERENCES.PREFER_MORE,
            preferSharpsOrFlats:  SHARPS_OR_FLATS_PREFERENCES.PRESERVE_ORIGINAL
        }
    
        let transposedToCFlatMajor = transposeABC(abcNotation, -1, sadisticOptions);
    
        //you can also set accidentalNumberPreference to no preference which will cause the
        //function to always select a key based on the sharps or flats preference
        //note that preferSharpsOrFlats is also evaluated when transposing to keys such as Gb major and F# major,
        //which have the same number of flats and sharps, respectively
    
        const preferFlats = {
            accidentalNumberPreference:  ACCIDENTAL_NUMBER_PREFERENCES.NO_PREFERENCE,
            preferSharpsOrFlats:  SHARPS_OR_FLATS_PREFERENCES.PREFER_FLATS
        }
        
        const preferSharps = {
            accidentalNumberPreference:  ACCIDENTAL_NUMBER_PREFERENCES.NO_PREFERENCE,
            preferSharpsOrFlats:  SHARPS_OR_FLATS_PREFERENCES.PREFER_SHARPS 
        }
    
        transposedToCFlatMajor = transposeABC(abcNotation, -1, preferFlats);
  
        const transposedToCSharpMajor = transposeABC(abcNotation, 1, preferSharps);
    
        //an interesting use case for these options is to transpose music at the unison in order to change the key
        //to a more readable enharmonic key
    
        const transposedToBMajor = transposeABC(transposedToCFlatMajor, INTERVALS.UNISON); //default options will prefer fewer accidentals
    
        const transposedToDbMajor = transposeABC(transposedToCSharpMajor, INTERVALS.UNISON);
    
    } catch(e) {
        console.log(e.message);
    }

### Valid Key Signatures

This module will evaluate any existing major or minor key, any existing mode, and atonal keys. 

Keys must be specified with a capital letter, optionally followed by a 'b' for a flat, or a '#' representing a sharp. The module will also accept 'none' or an empty string to represent no key signature (for atonal music).

Bagpipe specific keys will cause the transposition function to ignore that voice, as bagpipe keys (notated in Abc with 'K:HP' or 'K:Hp') have very specific rules. 

See https://abcnotation.com/wiki/abc:standard:v2.1#kkey for more information.

    //Examples of valid keys:
    //Examples of major and ionian
	const CMajor = 'K:Cmajor';
	const DMajor = 'K:Dmaj'
	const EMajor = 'K:E';
	const FIonian = 'K:Fionian';
	const GIonian = 'K:Gion';
	
	//examples of minor and aeolian
	const Cminor = 'K:Cminor';
	const Dminor = 'K:Dmin';
	const Eminor = 'K:Em';
	const Faeolian = 'K:Faeolian';
	const Gaeolian = 'K:Gaeo';
	
	//examples of modes
	const Ddorian = 'K:Ddorian'; //or 'Ddor'
	const Ephrygian = 'K:Ephrygian'; //or 'Ephr'
	const Flydian = 'K:Flydian'; //or 'Flyd'
	const Gmixolydian = 'K:Gmixolydian'; //or 'Gmix'
	const Blocrian = 'K:Blocrian'; //or 'Bloc'

	//atonal K field:
	const atonal = 'K:none';
	const atonal2 = 'K:';

Note that only the key letter is case-sensitive. The mode can appear in any case and can be separated from the key letter by any number of spaces.

You may change keys at any point in the tune body by using an inline field like this:

    const abcNotation =
    `X:4
    M:C
    L:1/4
    K:C
    A,B,CD|E2G2|[K:F]F2Ac|f4|]`; //anything after [K:F] is in F major

### Atonal Music

The module is quite capable of handling atonal music. Here is an excerpt of the A clarinet part from Schoenberg's Pierrot Lunaire transposed to concert pitch.

    const {transposeABC, INTERVALS} = require('abc-notation-transposition');
    const  pierrotAClarinet =
    `X:5
    T:Pierrot Lunaire
    C:Arnold Schoenberg
    M:C
    L:1/8
    K:
    [V:Clarinet name="Klarinette in A."]
    !ppp!(f4F4)|z2(_A2g2(d2|d6).D)z|(=B=F=G)zz2._B,z|`;
    
    const  pierrotAtConcertPitch = transposeABC(pierrotAClarinet, INTERVALS.DESCENDING.MINOR_THIRD);
    
    /* yields:
    `X:5
    T:Pierrot Lunaire
    C:Arnold Schoenberg
    M:C
    L:1/8
    K:
    [V:Clarinet name="Klarinette in A."]
    !ppp!(d4D4)|z2(F2e2(B2|B6).B,)z|(_ADE)zz2.G,z|`
    */

### New Measures & Introduced Accidentals

Occasionally, transposition of a certain pitch will result in the introduction of an accidental that was not present in the original. 

For instance, consider an attempt to transpose an E𝄪 (E double-sharp) from C major to D major:

The module will attempt to keep the scale degree of the pitch intact in the new key. E is the 3rd scale degree in C major, so some kind of E in C major should result in some kind of F in D major. However, because E𝄪 is 2 half steps above its normal pitch level in the key signature, it is impossible to represent this as some kind of F in D major, as this would mean raising *F#* by 2 half steps, which cannot be represented by traditional accidentals, as it would be 3 half steps about F natural. 

The great news is that the module will transpose it to an enharmonic pitch, selected intelligently based on the accidentals in the key signature and the direction of transposition. It will then decide if the accident needs to be displayed based on the context the note was transposed from. Therefore, our E𝄪 in C major will become a G# in D major.

If a G# appeared previously in the measure, the accidental will not be displayed. If not, the accidental *will* be displayed, and, if, for instance, the E𝄪 was followed by an F (natural) in the printed music *within the same measure*, the module is smart enough to know that the G natural that results from transposition to Dmajor *does* need to be marked with a natural sign, even though it hasn't deviated from the key signature. Only the first occurrence of this note is marked, unless another foreign accidental is introduced later.

A new measure (indicated by a pipe '|'), resets the stored accidentals to those of the key signature.

### Multiple Voices

The module supports multiple voices, each of which can have their own distinct key and clef.

Voices can be organized in several different ways. For more information on this, see: https://abcnotation.com/wiki/abc:standard:v2.1#multiple_voices.

Here is a simple example:

    const abcNotation =
    `X:6
    M:3/4
    L:1/8
    T:Concerto no. 1 in F minor
    C:Carl Maria von Weber
    V:BbClarinet clef=treble name="Clarinet in B-flat"
    V:PianoRH clef=treble name=Piano
    V:PianoLH bass
    K:Fmin
    %%staves BbClarinet {PianoRH PianoLH}
    [V:BbClarinet][K:Gm](b6 | ^f4 g2 | d4 {f}e2 | d6 |
    [V:PianoRH]z!pp![CA,][CA,][CA,][CA,][CA,]|[CA,][CA,][CA,][CA,][CA,][CA,]|z[CA,][CA,][CA,][CA,][CA,]|[CA,][CA,][CA,][CA,][CA,][CA,]|
    [V:PianoLH]F,6 | z6 | F,6 |`;

	const transposedToGMinor = transposeABC(abcNotation, 2);

Even though the clarinet part is in a different key, each voice will be correctly transposed from the key that individual voice is in. Notice that only the clarinet voice required an inline K field, as the piano voices take their key from the K field in the head.

### Percussion
Tunes and voices with a percussion clef will not be transposed. There are a few ways of indicating this.

To indicate that an entire tune should use a percussion clef, unless otherwise specified in a voice or voices, set the clef in the head:

    const abcNotation =
    `X:7
    K:none clef=perc
	ABCD`;
To indicate that a specific voice should use a percussion clef, indicate this in a V field in the head or body, or in an inline K field in the tune body.

    const abcNotation =
    `X:8
    K:none
    V:SnareDrum clef=perc name="Snare Drum"
    V:Cymbals name=Cymbals
    V:BassDrum name="Bass Drum"
    [V:SnareDrum]`
    ABCD|]
    [V:Cymbals perc]
    ABCD|]
    [V:BassDrum][K:none clef=perc]
    ABCD|]


### Common Gotchas
#### Lack of tune head / key
`transposeAbc` expects abc notation which contains a head and body. The head is terminated by the K: field, and must, at minimum, also include an X: field (the tune reference number).

Valid:

    `X:1
    K:C
    CDEF`

Invalid (lacks a tune head):

    `K:C
    CDEF`
Invalid (lacks a key field):

    `X:1
    CDEF`

#### Escape Characters
Note that the backslash is a meaningful character in abc notation. In a JavaScript String, this represents an escape character, so it itself must be escaped with a second backslash.

## License

MIT License

Copyright (c) 2022 Joseph Dvorak

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
