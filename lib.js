const formatLut = {
	"x": {
		"format": "x",
		"c_type": "pad_byte",
		"python_type": "no_value",
		"standard_size": null

	},
	"c": {
		"format": "c",
		"c_type": "char",
		"python_type": "bytes of length 1",
		"standard_size": 1
	},
	"b": {
		"format": "b",
		"c_type": "signed_char",
		"python_type": "integer",
		"standard_size": 1
	},
	"B": {
		"format": "B",
		"c_type": "unsigned_char",
		"python_type": "integer",
		"standard_size": 1
	},
	"?": {
		"format": "?",
		"c_type": "_Bool",
		"python_type": "bool",
		"standard_size": 1
	},
	"h": {
		"format": "h",
		"c_type": "short",
		"python_type": "integer",
		"standard_size": 2
	},
	"H": {
		"format": "H",
		"c_type": "unsigned_short",
		"python_type": "integer",
		"standard_size": 2
	},
	"i": {
		"format": "i",
		"c_type": "int",
		"python_type": "integer",
		"standard_size": 4
	},
	"I": {
		"format": "I",
		"c_type": "unsigned_int",
		"python_type": "integer",
		"standard_size": 4
	},
	"l": {
		"format": "l",
		"c_type": "long",
		"python_type": "integer",
		"standard_size": 4
	},
	"L": {
		"format": "L",
		"c_type": "unsigned_long",
		"python_type": "integer",
		"standard_size": 4
	},
	"q": {
		"format": "q",
		"c_type": "long_long",
		"python_type": "integer",
		"standard_size": 8
	},
	"Q": {
		"format": "Q",
		"c_type": "unsigned_long_long",
		"python_type": "integer",
		"standard_size": 8
	},
	"n": {
		"format": "n",
		"c_type": "ssize_t",
		"python_type": "integer",
		"standard_size": null
	},
	"N": {
		"format": "N",
		"c_type": "size_t",
		"python_type": "integer",
		"standard_size": null
	},
	"e": {
		"format": "e",
		"c_type": "TODO",
		"python_type": "float",
		"standard_size": 2
	},
	"f": {
		"format": "f",
		"c_type": "float",
		"python_type": "float",
		"standard_size": 4
	},
	"d": {
		"format": "d",
		"c_type": "double",
		"python_type": "float",
		"standard_size": 8
	},
	"s": {
		"format": "s",
		"c_type": "char[]",
		"python_type": "bytes",
		"standard_size": null
	},
	"p": {
		"format": "p",
		"c_type": "char[]",
		"python_type": "bytes",
		"standard_size": null
	},
	"P": {
		"format": "P",
		"c_type": "void*", 
		"python_type": "integer",
		"standard_size": null
	}
}

const byteOrderSizeAlignmentLut = {
    "@": {
        "char": "@",
        "byte_order": "native",
        "size": "native",
        "alignment": "native"
    },
    "=": {
        "char": "=",
        "byte_order": "native",
        "size": "standard",
        "alignment": "none"
    },
    "<": {
        "char": "<",
        "byte_order": "little_endian",
        "size": "standard",
        "alignment": "none"
    },
    ">": {
        "char": ">",
        "byte_order": "big_endian",
        "size": "standard",
        "alignment": "none"
    },
    "!": {
        "char": "!",
        "byte_order": "network",
        "size": "standard",
        "alignment": "none"
    }
}

const DEFAULT_BYTE_ORDER_SIZE_ALIGNMENT = "@";

const invalidMessage = "Not a valid Python3 struct format string"; 

function explainFormatString(formatString) {
  let isInvalid = false;
  const L = formatString.length;

  if (L < 1) {
    return invalidMessage;
  }

  let byteOrderSizeAlignment = null;
  const firstChar = formatString[0];
  if (byteOrderSizeAlignmentLut.hasOwnProperty(firstChar)) {
    byteOrderSizeAlignment = byteOrderSizeAlignmentLut[firstChar];
  } else {
    byteOrderSizeAlignment = byteOrderSizeAlignmentLut[DEFAULT_BYTE_ORDER_SIZE_ALIGNMENT];
  }


  const formatChars = [];
  let i = 1;
  let 
  while (i < L) {
    const ch = formatString[i];


    if (!formatLut.hasOwnProperty(ch)) {
      return invalidMessage;
    }
    formatChars.push(formatLut[ch]);
    i = i + 1;
  }

  return {
    byteOrderSizeAlignment,
    formatChars
  };
}


function renderExplanation(explanation) {
  return JSON.stringify(explanation);
}

try {
  module.exports = {
    explain: explainFormatString,
    render: renderExplanation
  }
} catch(e) {
  // The file is being run by the browser, which doesn't have the module variable defined
  // place it in the window object
  window.explainFormatString = explainFormatString;
  window.renderExplanation = renderExplanation;
}
