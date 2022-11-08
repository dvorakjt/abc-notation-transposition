const ABC_NOTATION_TYPE_MISMATCH = 
`Expected abcTune to be a string. Received `;

const HALF_STEPS_TYPE_MISMATCH =
`Expected halfSteps to be an integer. Received `;

const OPTS_OBJECT_TYPE_MISMATCH = 
`Expected opts to be an object with the following fields:
{
    accidentalNumberPreference: ACCIDENTAL_NUMBER_PREFERENCES.PREFER_FEWER, //other options are .NO_PREFERENCE and .PREFER_MORE
    preferSharpsOrFlats: SHARPS_OR_FLATS_PREFERENCES.PRESERVE_ORIGINAL //other options are .PREFER_FLATS and .PREFER_SHARPS
}`

const OPTS_FIELD_TYPE_MISMATCH = 
`Expected opts.accidentalNumberPreference and opts.preferSharpsOrFlats to be numbers integers 0 and 2 (inclusive). Received `;

const UNABLE_TO_SPLIT_HEAD_KEY_AND_BODY = 
`Unable to split head tune and body. At minimum, ensure that your ABC notation \
is stuctured in the following way:

X:1 %the minimum required head field
K: %the key field which indicates the key of the piece and ends the header.
C D E F %the tune body. can be any valid pitches.`;

module.exports.ERROR_MESSAGES = {
    ABC_NOTATION_TYPE_MISMATCH,
    HALF_STEPS_TYPE_MISMATCH,
    OPTS_OBJECT_TYPE_MISMATCH,
    OPTS_FIELD_TYPE_MISMATCH,
    UNABLE_TO_SPLIT_HEAD_KEY_AND_BODY,
}