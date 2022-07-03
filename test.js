const assert = require("assert");
const {
  coalesceFormats,
  explain,
  FormatInfo,
  byteOrderLut,
  formatLut,
  Explanation,
} = require("./lib.js");

assert.deepStrictEqual(
  coalesceFormats([
    new FormatInfo(1, formatLut["H"], 1, 1),
    new FormatInfo(1, formatLut["H"], 2, 2),
  ]),
  [new FormatInfo(2, formatLut["H"], 1, 2)]
);

assert.deepStrictEqual(
  coalesceFormats([
    new FormatInfo(1, formatLut["H"], 1, 1),
    new FormatInfo(1, formatLut["H"], 2, 2),
    new FormatInfo(1, formatLut["h"], 3, 3),
  ]),
  [
    new FormatInfo(2, formatLut["H"], 1, 2),
    new FormatInfo(1, formatLut["h"], 3, 3),
  ]
);

assert.deepStrictEqual(
  coalesceFormats([
    new FormatInfo(1, formatLut["H"], 1, 1),
    new FormatInfo(1, formatLut["H"], 2, 2),
    new FormatInfo(1, formatLut["h"], 3, 3),
    new FormatInfo(2, formatLut["B"], 4, 5),
    new FormatInfo(1, formatLut["B"], 6, 6),
    new FormatInfo(4, formatLut["B"], 7, 10),
  ]),
  [
    new FormatInfo(2, formatLut["H"], 1, 2),
    new FormatInfo(1, formatLut["h"], 3, 3),
    new FormatInfo(7, formatLut["B"], 4, 10),
  ]
);

assert.deepStrictEqual(
  explain("<H"),
  new Explanation(
    byteOrderLut["<"],
    [new FormatInfo(1, formatLut["H"], 1, 1)],
    false
  )
);

assert.deepStrictEqual(
  explain("<HH"),
  new Explanation(
    byteOrderLut["<"],
    [new FormatInfo(2, formatLut["H"], 1, 2)],
    false
  )
);

assert.deepStrictEqual(
  explain("<2h"),
  new Explanation(
    byteOrderLut["<"],
    [new FormatInfo(2, formatLut["h"], 1, 2)],
    false
  )
);

assert.deepStrictEqual(
  explain("<3hh"),
  new Explanation(
    byteOrderLut["<"],
    [new FormatInfo(4, formatLut["h"], 1, 3)],
    false
  )
);

assert.throws(() => explain("<3hh3"));

assert.throws(() => explain("<4"));

assert.throws(() => explain("4"));

const green = "\x1b[32m";
const reset = "\x1b[0m";
console.log(`${green}Passed!${reset}`);
