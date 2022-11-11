const {transposeABC, INTERVALS} = require('../../index');

const pierrotAClarinet = 
`X:1
T:Pierrot Lunaire
C:Arnold Schoenberg
M:C
L:1/8
K:
[V:Clarinet name="Klarinette in A."]
!ppp!(f4F4)|z2(_A2g2(d2|d6).D)z|(=B=F=G)zz2._B,z|`;

const pierrotAtConcertPitch = 
`X:1
T:Pierrot Lunaire
C:Arnold Schoenberg
M:C
L:1/8
K:
[V:Clarinet name="Klarinette in A."]
!ppp!(d4D4)|z2(F2e2(B2|B6).B,)z|(_ADE)zz2.G,z|`

test("Expect atonal music to transpose correctly.", () =>{
    const transposedPierrot = transposeABC(pierrotAClarinet, INTERVALS.DESCENDING.MINOR_THIRD);
    expect(transposedPierrot).toBe(pierrotAtConcertPitch);
});
