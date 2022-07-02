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
    c_type: "TODO",
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
  },
  p: {
    char: "p",
    c_type: "char[]",
    python_type: "bytes",
    standard_size: null,
  },
  P: {
    char: "P",
    c_type: "void*",
    python_type: "integer",
    standard_size: null,
  },
};

const byteOrderLut = {
  "@": {
    char: "@",
    byte_order: "native",
    size: "native",
    alignment: "native",
  },
  "=": {
    char: "=",
    byte_order: "native",
    size: "standard",
    alignment: "none",
  },
  "<": {
    char: "<",
    byte_order: "little_endian",
    size: "standard",
    alignment: "none",
  },
  ">": {
    char: ">",
    byte_order: "big_endian",
    size: "standard",
    alignment: "none",
  },
  "!": {
    char: "!",
    byte_order: "network",
    size: "standard",
    alignment: "none",
  },
};

const DEFAULT_BYTE_ORDER_SIZE_ALIGNMENT = "@";

const invalidMessage = "Not a valid Python3 struct format string";

function isNumberChar(ch) {
  return "1234567990".includes(ch);
}

class FormatInfo {
  constructor(count, format, start, end) {
    if (end - start + 1 !== count) {
      throw "Start, end and count parameters don't make sense.";
    }
    this.count = count;
    this.format = format;
    this.start = start;
    this.end = end;
  }
}

function coalesceFormats(formats) {
  let newFormats = [formats[0]];
  for (let i = 1; i < formats.length; i++) {
    const previousFormatInfo = newFormats[newFormats.length - 1];
    const formatInfo = formats[i];
    if (formatInfo.format.char === previousFormatInfo.format.char) {
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

function explainFormatString(formatString) {
  let isInvalid = false;
  const L = formatString.length;

  if (L < 1) {
    return invalidMessage;
  }

  let byteOrder = null;
  const firstChar = formatString[0];
  if (byteOrderLut.hasOwnProperty(firstChar)) {
    byteOrder = byteOrderLut[firstChar];
  } else {
    byteOrder = byteOrderLut[DEFAULT_BYTE_ORDER_SIZE_ALIGNMENT];
  }

  let formats = [];
  let i = 1;
  let processingCount = false;
  let countBuffer = [];
  while (i < L) {
    const ch = formatString[i];

    if (ch === " " && processingCount) {
      // whitespace chars cant be part of count + format
      return invalidMessage;
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
    if (processingCount) {
      processingCount = false;
      count = parseInt(countBuffer.join(""));
      countBuffer = [];
    }

    if (!formatLut.hasOwnProperty(ch)) {
      return invalidMessage;
    }
    const formatInfo = new FormatInfo(count, formatLut[ch], i, i);
    formats.push(formatInfo);
    i = i + 1;
  }

  formats = coalesceFormats(formats);

  return {
    byteOrder,
    formats,
  };
}

function renderExplanation(explanation) {
  return JSON.stringify(explanation);
}

try {
  module.exports = {
    explain: explainFormatString,
    render: renderExplanation,
    byteOrderLut,
    formatLut,
    FormatInfo,
    coalesceFormats,
  };
} catch (e) {
  console.log(e);
  // The file is being run by the browser, which doesn't have the module variable defined
  // place it in the window object
  window.explainFormatString = explainFormatString;
  window.renderExplanation = renderExplanation;
}
