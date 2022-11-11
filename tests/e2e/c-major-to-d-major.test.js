const {transposeABC} = require('../../index');

test('Expect transposeABC to correctly transpose a simple tune from C to D.', () => {
    //valid abc notation string
const abcNotation = 
`X:1
M:C
L:1/4
K:C
CDEF|GABc|]`;
   
    const transposedAbcNotation = transposeABC(abcNotation, 2);

    expect(transposedAbcNotation).toBe(
`X:1
M:C
L:1/4
K:Dmajor
DEFG|ABcd|]`
    );
});