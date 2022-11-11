const {checkForNewClefAndUpdateState} = require('../../../../functions/transpose-abc');

test('Expect checkForNewClefAndUpdateState to leave the clef as is if no new clef is detected.', () => {
    const voiceLine = 'ABCD|EFGA|]';
    const voiceState = {
        clef: 'treble'
    }
    checkForNewClefAndUpdateState(voiceLine, voiceState);
    expect(voiceState.clef).toBe('treble');
});

test('Expect checkForNewClefAndUpdateState to change the clef if it detects a new clef.', () => {
    const voiceLine = '[K: C major clef=bass]';
    const voiceState = {
        clef: 'treble'
    }
    checkForNewClefAndUpdateState(voiceLine, voiceState);
    expect(voiceState.clef).toBe('bass');
});