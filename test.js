const assert = require("assert");
const {
  coalesceFormats,
  explain,
  FormatInfo,
  byteOrderLut,
  formatLut,
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
  [new FormatInfo(2, formatLut["H"], 1, 2), new FormatInfo(1, formatLut["h"], 3, 3)]
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
  [new FormatInfo(2, formatLut["H"], 1, 2), new FormatInfo(1, formatLut["h"], 3, 3), new FormatInfo(7, formatLut["B"], 4, 10)]
);

assert.deepStrictEqual(explain("<H"), {
  byteOrder: byteOrderLut["<"],
  formats: [new FormatInfo(1, formatLut["H"], 1, 1)],
});

assert.deepStrictEqual(explain("<HH"), {
  byteOrder: byteOrderLut["<"],
  formats: [new FormatInfo(2, formatLut["H"], 1, 2)],
});

const green = "\x1b[32m";
const reset = "\x1b[0m"
console.log(`${green}Passed!${reset}`);
