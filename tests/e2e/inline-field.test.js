const { transposeABC } = require("../../index");

test("Expect transposeABC to transpose a tune with inline fields.", () => {
  const original = `
X:1
T:I Saw Three Ships
C:Traditional English
I:score (1 2) (3 4)
I:voicecombine 1
L:1/1
M:3/4
Q:1/4=100
K:G
V:1 clef=treble stem=up
[M:3/4] |: D/8 | G/4 G/8 A/4 B/8 |  d/4 B/8 A/4 c/8 | [1 B/4 G/8 G/4 B/8 |  A/4 F/8 D/4 :| [2 B/4 G/8 G/8 A/8 B/8 | A3/8 G/4 |]
V:2 clef=treble stem=down
%%repbra 0
|: B,/8 | D/4 D/8 D/4 G/8 | G/4 G/8 D/4 A/8 | [1 G/4 D/8 D/4 G/8 | D/4 D/8 A,/4 :| [2 G/4 D/8 D/8 G/8 G/8 | D3/8 D/4 |]
V:3 clef=bass stem=up
%%repbra 0
I:pos vocal above
[M:3/4] |: G,/8 | B,/4 B,/8 B,/4 B,/8 | D/4 D/8 A,/4 A,/8 | [1 B,/4 B,/8 B,/4 D/8 | A,/4 A,/8 A,/4 :| [2 D/4 B,/8 B,/8 D/8 D/8 | A,3/8 B,/4 |]
V:4 clef=bass stem=down
%%repbra 0
|: D,/8 | G,/4 G,/8 A,/4 G,/8 | G,/4 G,/8 D,/4 F,/8 | [1 G,/4 G,/8 G,/4 B,/8 | D,/4 D,/8 D,/4 :| [2 G,/4 G,/8 G,/8 A,/8 G,/8 | D,3/8 [G,,G,]/4 |]
`;

  const transposed = transposeABC(original, -2);

  expect(transposed).toBe(`
X:1
T:I Saw Three Ships
C:Traditional English
I:score (1 2) (3 4)
I:voicecombine 1
L:1/1
M:3/4
Q:1/4=100
K:Fmajor
V:1 clef=treble stem=up
[M:3/4] |: C/8 | F/4 F/8 G/4 A/8 |  c/4 A/8 G/4 B/8 | [1 A/4 F/8 F/4 A/8 |  G/4 E/8 C/4 :| [2 A/4 F/8 F/8 G/8 A/8 | G3/8 F/4 |]
V:2 clef=treble stem=down
%%repbra 0
|: A,/8 | C/4 C/8 C/4 F/8 | F/4 F/8 C/4 G/8 | [1 F/4 C/8 C/4 F/8 | C/4 C/8 G,/4 :| [2 F/4 C/8 C/8 F/8 F/8 | C3/8 C/4 |]
V:3 clef=bass stem=up
%%repbra 0
I:pos vocal above
[M:3/4] |: F,/8 | A,/4 A,/8 A,/4 A,/8 | C/4 C/8 G,/4 G,/8 | [1 A,/4 A,/8 A,/4 C/8 | G,/4 G,/8 G,/4 :| [2 C/4 A,/8 A,/8 C/8 C/8 | G,3/8 A,/4 |]
V:4 clef=bass stem=down
%%repbra 0
|: C,/8 | F,/4 F,/8 G,/4 F,/8 | F,/4 F,/8 C,/4 E,/8 | [1 F,/4 F,/8 F,/4 A,/8 | C,/4 C,/8 C,/4 :| [2 F,/4 F,/8 F,/8 G,/8 F,/8 | C,3/8 [F,,F,]/4 |]`);
});
