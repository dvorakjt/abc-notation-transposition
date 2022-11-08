//separating strings allows them to be combinable and for flags to be added to individual regexes
const REGULAR_EXPRESSION_STRINGS = {
    KEY_SIGNATURES : 'none|HP|Hp|([A-G][b#]{0,1})',
    MODES : 'major|maj|dorian|dor|phrygian|phr|mixolydian|mix|lydian|lyd|minor|min|m|aeolian|aeo|locrian|loc',
    MAJOR_MODE : 'major|maj',
    CLEFS : '((clef=){0,1}(treble|alto|tenor|bass|perc)([+\\-]8){0,1})',
    MIDDLE : '(middle=[^\\s\\]]+)',
    TRANSPOSE : '(transpose=[+\-]{0,1}\\d+)',
    OCTAVE : '(octave=\\d+)',
    STAFF_LINES : '(stafflines=\\d+)',
    VOICE_NAME : 'V:\\s*[^\\s\\]]+', //older version 'V:\\s*[^\\s]+(\\s|\\])'
    KEY_FIELD : '(K:.*)',
    VOICE_FIELD : '(V:.*)',
    INLINE_FIELD : '([IKLMmNPQRrsTUVWw]:.*)',
    INLINE_FIELD_WITH_BRACKETS: '(\\[[IKLMmNPQRrsTUVWw]:.*\\])',
    COMMENT : '(%.*)', //older version : (%.*\\n)
    SYMBOL : '(\\![^\\s]+\\!)',
    NEW_MEASURE: '(\\|)|(::)',
    NOTE : "(_*\\^*={0,1}[A-Ga-g],*'*)"
}

module.exports.REGULAR_EXPRESSIONS = {
    KEY_SIGNATURES : new RegExp(REGULAR_EXPRESSION_STRINGS.KEY_SIGNATURES),
    MODES : new RegExp(REGULAR_EXPRESSION_STRINGS.MODES, 'i'),
    MAJOR_MODE : new RegExp(REGULAR_EXPRESSION_STRINGS.MAJOR_MODE, 'i'),
    CLEFS : new RegExp(REGULAR_EXPRESSION_STRINGS.CLEFS),
    MIDDLE : new RegExp(REGULAR_EXPRESSION_STRINGS.MIDDLE),
    TRANSPOSE : new RegExp(REGULAR_EXPRESSION_STRINGS.TRANSPOSE),
    OCTAVE : new RegExp(REGULAR_EXPRESSION_STRINGS.OCTAVE),
    STAFF_LINES : new RegExp(REGULAR_EXPRESSION_STRINGS.STAFF_LINES),
    KEY_FIELD_INSTRUCTIONS : new RegExp((
        REGULAR_EXPRESSION_STRINGS.CLEFS + '|' +
        REGULAR_EXPRESSION_STRINGS.MIDDLE + '|' +
        REGULAR_EXPRESSION_STRINGS.TRANSPOSE + '|' +
        REGULAR_EXPRESSION_STRINGS.OCTAVE + '|' +
        REGULAR_EXPRESSION_STRINGS.STAFF_LINES
    ), 'gi'),
    VOICE_NAME : new RegExp(REGULAR_EXPRESSION_STRINGS.VOICE_NAME),
    COMMENT : new RegExp(REGULAR_EXPRESSION_STRINGS.COMMENT),
    SYMBOL : new RegExp(REGULAR_EXPRESSION_STRINGS.SYMBOL),
    NOTE : new RegExp(REGULAR_EXPRESSION_STRINGS.NOTE),
    FIELD_COMMENT_SYMBOL_NEW_MEASURE_OR_NOTE : new RegExp((
        REGULAR_EXPRESSION_STRINGS.INLINE_FIELD_WITH_BRACKETS + '|' +
        REGULAR_EXPRESSION_STRINGS.INLINE_FIELD + '|' +
        REGULAR_EXPRESSION_STRINGS.COMMENT + '|' +
        REGULAR_EXPRESSION_STRINGS.SYMBOL + '|' +
        REGULAR_EXPRESSION_STRINGS.NEW_MEASURE + '|' +
        REGULAR_EXPRESSION_STRINGS.NOTE
    ), 'g'),
    COMMENT_OR_SYMBOL : new RegExp(
        REGULAR_EXPRESSION_STRINGS.COMMENT + '|' +
        REGULAR_EXPRESSION_STRINGS.SYMBOL
    ),
    FIELD : new RegExp(
        REGULAR_EXPRESSION_STRINGS.INLINE_FIELD_WITH_BRACKETS + '|' +
        REGULAR_EXPRESSION_STRINGS.INLINE_FIELD
    ),
    NEW_MEASURE : new RegExp(REGULAR_EXPRESSION_STRINGS.NEW_MEASURE),
    KEY_FIELD : new RegExp(REGULAR_EXPRESSION_STRINGS.KEY_FIELD),
    VOICE_FIELD : new RegExp(REGULAR_EXPRESSION_STRINGS.VOICE_FIELD)
}   