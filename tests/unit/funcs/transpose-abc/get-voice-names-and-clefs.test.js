const {getVoiceNamesAndClefs} = require('../../../../functions/transpose-abc');

test('Expect getVoiceNamesAndClefs to return an empty object for a tuneHead which lacks V: lines.', () => {
    const tuneHead = 'X:1\nT:A Very Good Title\nM:4/4\nL:1/4\n';
    expect(getVoiceNamesAndClefs(tuneHead)).toEqual({});
});

test('Expect getVoiceNamesAndClefs to return an object with keys and values corresponding to voiceNames and clefs respectively.', () => {
    const tuneHead = 'X:1\nT:A Very Good Title\nM:4/4\nL:1/4\nV: clarinet clef=treble\n      V: snaredrum  perc';
    expect(getVoiceNamesAndClefs(tuneHead)).toEqual({
        clarinet: 'treble',
        snaredrum: 'perc'
    });
});