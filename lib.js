const formatLut = {
  x: {
    char: "x",
    c_type: "pad_byte",
    python_type: "no_value",
    standard_size: null,
  },
  c: {
    char: "c",
    c_type: "char",
    python_type: "bytes of length 1",
    standard_size: 1,
  },
  b: {
    char: "b",
    c_type: "signed_char",
    python_type: "integer",
    standard_size: 1,
  },
  B: {
    char: "B",
    c_type: "unsigned_char",
    python_type: "integer",
    standard_size: 1,
  },
  "?": {
    char: "?",
    c_type: "_Bool",
    python_type: "bool",
    standard_size: 1,
    note: "<tt>_Bool</tt> type is defined by C99. If this type is not available, it is simulated using a <tt>char</tt>.",
  },
  h: {
    char: "h",
    c_type: "short",
    python_type: "integer",
    standard_size: 2,
  },
  H: {
    char: "H",
    c_type: "unsigned_short",
    python_type: "integer",
    standard_size: 2,
  },
  i: {
    char: "i",
    c_type: "int",
    python_type: "integer",
    standard_size: 4,
  },
  I: {
    char: "I",
    c_type: "unsigned_int",
    python_type: "integer",
    standard_size: 4,
  },
  l: {
    char: "l",
    c_type: "long",
    python_type: "integer",
    standard_size: 4,
  },
  L: {
    char: "L",
    c_type: "unsigned_long",
    python_type: "integer",
    standard_size: 4,
  },
  q: {
    char: "q",
    c_type: "long_long",
    python_type: "integer",
    standard_size: 8,
  },
  Q: {
    char: "Q",
    c_type: "unsigned_long_long",
    python_type: "integer",
    standard_size: 8,
  },
  n: {
    char: "n",
    c_type: "ssize_t",
    python_type: "integer",
    standard_size: null,
  },
  N: {
    char: "N",
    c_type: "size_t",
    python_type: "integer",
    standard_size: null,
  },
  e: {
    char: "e",
    c_type: "IEEE 754 binary16 <a href='https://en.wikipedia.org/wiki/Half-precision_floating-point_format'>'half precision'</a> type",
    python_type: "float",
    standard_size: 2,
  },
  f: {
    char: "f",
    c_type: "float",
    python_type: "float",
    standard_size: 4,
  },
  d: {
    char: "d",
    c_type: "double",
    python_type: "float",
    standard_size: 8,
  },
  s: {
    char: "s",
    c_type: "char[]",
    python_type: "bytes",
    standard_size: null,
    note: "The preceeding count determines the length of the bytes."
  },
  p: {
    char: "p",
    c_type: "char[]",
    python_type: "bytes",
    standard_size: null,
    note: "This is a <i>Pascal string</i> &mdash; short variable-length string stored in a fixed number of bytes, given by the count."
  },
  P: {
    char: "P",
    c_type: "void*",
    python_type: "integer",
    standard_size: null,
    note: "Only available for native byte ordering."
  },
};

const byteOrderLut = {
  "@": {
    char: "@",
    byte_order: "native",
    size: "native",
    alignment: "native",
    description:
      "signifies native byte order, sizes, and alignment. Byte order can be <a href='https://en.wikipedia.org/wiki/Endianness'>little-endian</a> or <a href='https://en.wikipedia.org/wiki/Endianness'>big-endian</a>, dependent on the host system. Use <tt><a href='https://docs.python.org/3/library/sys.html#sys.byteorder'>sys.byteorder</a></tt> to check the endianness of your system. Sizes and alignment are determined using the C compiler's <tt><a href='https://en.wikipedia.org/wiki/Sizeof'>sizeof</a></tt> expression",
  },
  "=": {
    char: "=",
    byte_order: "native",
    size: "standard",
    alignment: "none",
    description:
      "signifies native byte order, but uses standardized sizes and alignment. Byte order can be <a href='https://en.wikipedia.org/wiki/Endianness'>little-endian</a> or <a href='https://en.wikipedia.org/wiki/Endianness'>big-endian</a>, dependent on the host system. Use <tt><a href='https://docs.python.org/3/library/sys.html#sys.byteorder'>sys.byteorder</a></tt> to check the endianness of your system. No padding is added when using non-native size and alignment",
  },
  "<": {
    char: "<",
    byte_order: "little_endian",
    size: "standard",
    alignment: "none",
    description:
      "signifies <a href='https://en.wikipedia.org/wiki/Endianness'>little-endian<a> byte order, and standardized sizes and alignment. No padding is added when using non-native size and alignment.",
  },
  ">": {
    char: ">",
    byte_order: "big_endian",
    size: "standard",
    alignment: "none",
    description:
      "signifies big-endian byte order, and standardized sizes and alignment. No padding is added when using non-native size and alignment.",
  },
  "!": {
    char: "!",
    byte_order: "network",
    size: "standard",
    alignment: "none",
    description:
      "signifies network byte order, defined by <a href='https://en.wikipedia.org/wiki/Endianness'>IETF RFC 1700</a> as <a href='https://en.wikipedia.org/wiki/Endianness'>big-endian</a>. No padding is added when using non-native size and alignment.",
  },
};

/**
 *
 * @param {Explanation} explanation
 * @returns
 */
function renderExplanation(explanation) {
  let defaultMessage = "";
  if (explanation.defaultByteOrderUsed) {
    defaultMessage =
      "No byte order, size, and alignment character. Using the default, which is <tt>@</tt>.\n";
  }

  let formatsDescriptions = "";
  for (const format of explanation.formats) {
    let sizeDescription = `Standard size: ${format.format.standard_size} bytes`;
    if (!format.format.standard_size) {
      sizeDescription = `No standard size defined.`
    }
    let formatDescription = `${format.count}&#215 <tt>${format.format.c_type}</tt>. Corresponding Python type: <tt>${format.format.python_type}</tt>. ${sizeDescription}`;
    if (format.format.note) {
      formatDescription = formatDescription + ` Note: ${format.format.note}`;
    }
    if (format.count === 0) {
      formatDescription = `<tt>${format.count}${format.format.char}</tt> aligns the end of the preceeding structure to the size of <tt>${format.format.c_type}</tt>. ${sizeDescription}`
    }
    formatDescription = `<p>${formatDescription}</p>`;
    formatsDescriptions = formatsDescriptions + formatDescription;
  }

  return `
  <p>${defaultMessage}</p>
  <p><tt>${explanation.byteOrder.char}</tt> ${explanation.byteOrder.description}.</p>
  ${formatsDescriptions}
  `;
}

const DEFAULT_BYTE_ORDER_SIZE_ALIGNMENT = "@";

function isNumberChar(ch) {
  return "1234567890".includes(ch);
}

// Just a way to have a name for this structure
class FormatInfo {
  constructor(count, format, start, end) {
    this.count = count;
    this.format = format;
    this.start = start;
    this.end = end;
  }
}

class Explanation {
  constructor(byteOrder, formats, defaultByteOrderUsed) {
    this.byteOrder = byteOrder;
    this.formats = formats;
    this.defaultByteOrderUsed = defaultByteOrderUsed;
  }
}

/**
 * Combine identical subsequent formats into one format with a count that is a sum of the subsequent formats
 * @param {FormatInfo[]} formats
 * @returns {FormatInfo[]} coalesced formats
 */
function coalesceFormats(formats) {
  let newFormats = [formats[0]];
  for (let i = 1; i < formats.length; i++) {
    const previousFormatInfo = newFormats[newFormats.length - 1];
    const formatInfo = formats[i];
    if (formatInfo.format.char === previousFormatInfo.format.char && previousFormatInfo.count !== 0) {
      newFormats.pop();
      const newCount = formatInfo.count + previousFormatInfo.count;
      const newFormatInfo = new FormatInfo(
        newCount,
        formatInfo.format,
        previousFormatInfo.start,
        formatInfo.end
      );
      newFormats.push(newFormatInfo);
    } else {
      newFormats.push(formatInfo);
    }
  }

  return newFormats;
}

/**
 * Parses the format string
 * @param {string} formatString
 * @returns {Explanation} explanation object
 */

function explainFormatString(formatString) {
  let isInvalid = false;
  const L = formatString.length;

  if (L < 1) {
    throw new Error("Format string must have at least one character.");
  }

  let byteOrder = null;
  const firstChar = formatString[0];
  let defaultByteOrderUsed = false;
  if (byteOrderLut.hasOwnProperty(firstChar)) {
    byteOrder = byteOrderLut[firstChar];
  } else {
    byteOrder = byteOrderLut[DEFAULT_BYTE_ORDER_SIZE_ALIGNMENT];
    defaultByteOrderUsed = true;
  }

  let formats = [];
  let i = 1;
  if (defaultByteOrderUsed) {
    i = 0;
  }
  let processingCount = false;
  let countBuffer = [];
  while (i < L) {
    const ch = formatString[i];

    if (ch === " " && processingCount) {
      // whitespace chars cant be part of count + format
      throw new Error(
        "Whitespace characters inside the count part are not allowed."
      );
    }

    if (ch === " " && !processingCount) {
      // whitespace chars are ignored otherwise
      i = i + 1;
      continue;
    }

    if (isNumberChar(ch) && !processingCount) {
      processingCount = true;
      countBuffer.push(ch);
      i = i + 1;
      continue;
    }

    if (isNumberChar(ch) && processingCount) {
      countBuffer.push(ch);
      i = i + 1;
      continue;
    }

    // at this point, ch isn't a number
    let count = 1;
    let start = i;
    let end = i;
    if (processingCount) {
      processingCount = false;
      count = parseInt(countBuffer.join(""));
      start = i - countBuffer.length;
      countBuffer = [];
    }

    if (!formatLut.hasOwnProperty(ch)) {
      throw new Error(`Unknown format character "${ch}".`);
    }
    const formatInfo = new FormatInfo(count, formatLut[ch], start, end);
    formats.push(formatInfo);
    i = i + 1;
  }
  if (formats.length < 1) {
    throw new Error("No format character found!");
  }
  if (processingCount) {
    throw new Error("Number can't be the last character in the format string.");
  }

  formats = coalesceFormats(formats);

  return new Explanation(byteOrder, formats, defaultByteOrderUsed);
}

try {
  module.exports = {
    explain: explainFormatString,
    render: renderExplanation,
    byteOrderLut,
    formatLut,
    FormatInfo,
    Explanation,
    coalesceFormats,
  };
} catch (e) {
  // The file is being run by the browser, which doesn't have the module variable defined
  // so place it in the window object
  // console.log(e);
  window.explainFormatString = explainFormatString;
  window.renderExplanation = renderExplanation;
}
