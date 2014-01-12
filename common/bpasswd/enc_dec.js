(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.EncDec = factory();
    }
}(this, function () {
  EncDec = {};

  EncDec.none = {
    encode: function(bytes) { return bytes; },
    decode: function(bytes) { return bytes; }
  };


  EncDec.word32 = {
    encode: function(bytes) {
      var nWords = bytes.length/4;
      var words = new Array(nWords);

      if (bytes.length % 4 != 0)
        return undefined;

      for (var i = 0; i < nWords; i += 1) {
        var idx = 4*i;
        words[i]  = (bytes[idx+3] & 0xFF);
        words[i] |= (bytes[idx+2] & 0xFF) <<  8;
        words[i] |= (bytes[idx+1] & 0xFF) << 16;
        words[i] |= (bytes[idx  ] & 0xFF) << 24;
      }

      return words;
    },

    decode: function(words) {
      var nWords = words.length;
      var bytes = new Array(nWords*4);

      for (var i = 0; i < nWords; i++) {
        bytes[i*4]   = (words[i] >>> 24) & 0xFF;
        bytes[i*4+1] = (words[i] >>> 16) & 0xFF;
        bytes[i*4+2] = (words[i] >>>  8) & 0xFF;
        bytes[i*4+3] = (words[i]       ) & 0xFF;
      }

      return bytes;
    }
  };


  EncDec.hex = {
    encode: function(bytes) {
      var hex = "";
      var c;

      for (var i = 0; i < bytes.length; i += 1) {
        c = bytes[i].toString(16);
        hex += (c.length == 1) ? "0"+c : c;
      }

      return hex;
    },

    decode: function(hex) {
      var bytes = new Array(hex.length/2);

      if (hex.length % 2 != 0)
        return undefined;

      for (var i = 0, j = 0; i < hex.length; i += 2, j += 1)
        bytes[j] = parseInt(hex.substring(i, i+2), 16);

      return bytes;
    }
  };


  EncDec.ascii = {
    encode: function(bytes) {
      var str = "";

      for (var i = 0; i < bytes.length; i += 1)
        str += String.fromCharCode(bytes[i]);

      return str;
    },

    decode: function(str) {
      var bytes = new Array(str.length);

      for (var i = 0; i < str.length; i += 1)
        bytes[i] = str.charCodeAt(i);

      return bytes;
    }
  };


  EncDec.base64 = {
    fwdTable_: [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
    "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
    "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3",
    "4", "5", "6", "7", "8", "9", "+", "/" ],

    revTable_: {},

    encode: function(bytes) {
      var rem = 3-bytes.length%3;
      var str = "";

      // Pad input
      if (rem != 3) {
        for (var i = 0; i < rem; i++)
          bytes.push(0);
      }

      var chars = bytes.length/3;

      for (var i = 0; i < chars; i++) {
        var octets = 0;
        octets |= ((bytes[i*3+0] & 0xFF) << 16);
        octets |= ((bytes[i*3+1] & 0xFF) <<  8);
        octets |= ((bytes[i*3+2] & 0xFF)      );

        str += EncDec.base64.fwdTable_[(octets >> 18) & 0x3F];
        str += EncDec.base64.fwdTable_[(octets >> 12) & 0x3F];
        str += EncDec.base64.fwdTable_[(octets >>  6) & 0x3F];
        str += EncDec.base64.fwdTable_[(octets      ) & 0x3F];
      }

      // Pad output
      if (rem != 3) {
        str = str.substr(0,str.length-rem);
        for (var i = 0; i < rem; i++)
          str += "=";
      }

      return str;
    },

    decode: function(str) {
      var bytes = [];
      var pad = 0;
      var strLen = str.length;
      var nSextets = strLen/4;

      if (str.charAt(strLen-1) == "=")
        pad++;
      if (str.charAt(strLen-2) == "=")
        pad++;
      str = str.replace(/=/g,"A");

      for (var i = 0; i < nSextets; i++) {
        var octets = 0;
        octets |= (EncDec.base64.revTable_[str.charAt(i*4+0)] << 18);
        octets |= (EncDec.base64.revTable_[str.charAt(i*4+1)] << 12);
        octets |= (EncDec.base64.revTable_[str.charAt(i*4+2)] <<  6);
        octets |= (EncDec.base64.revTable_[str.charAt(i*4+3)]      );

        bytes.push((octets >> 16) & 0xFF);
        bytes.push((octets >>  8) & 0xFF);
        bytes.push((octets      ) & 0xFF);
      }

      return (pad > 0) ? bytes.slice(0, -pad) : bytes;
    }
  };

  // populate reverse mapping table
  for (var i = 0; i < 64; i++)
    EncDec.base64.revTable_[EncDec.base64.fwdTable_[i]] = i;


  EncDec.conservative = {
    fwdTable_: [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
    "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
    "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3",
    "4", "5", "6", "7", "8", "9", "3", "6" ],

    encode: function(bytes) {
      var rem = 3-bytes.length%3;
      var str = "";

      // Pad input
      if (rem != 3) {
        for (var i = 0; i < rem; i++)
          bytes.push(0);
      }

      var chars = bytes.length/3;

      for (var i = 0; i < chars; i++) {
        var octets = 0;
        octets |= ((bytes[i*3+0] & 0xFF) << 16);
        octets |= ((bytes[i*3+1] & 0xFF) <<  8);
        octets |= ((bytes[i*3+2] & 0xFF)      );

        str += EncDec.conservative.fwdTable_[(octets >> 18) & 0x3F];
        str += EncDec.conservative.fwdTable_[(octets >> 12) & 0x3F];
        str += EncDec.conservative.fwdTable_[(octets >>  6) & 0x3F];
        str += EncDec.conservative.fwdTable_[(octets      ) & 0x3F];
      }

      // Pad output
      if (rem != 3) {
        str = str.substr(0,str.length-rem);
        for (var i = 0; i < rem; i++)
          str += "=";
      }

      return str;
    }
  }


  // Based on reference implementation for rfc.zeromq.org/spec:32/Z85
  EncDec.z85 = {
    fwdTable_: [
      "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
      "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
      "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
      "u", "v", "w", "x", "y", "z", "A", "B", "C", "D",
      "E", "F", "G", "H", "I", "J", "K", "L", "M", "N",
      "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X",
      "Y", "Z", ".", "-", ":", "+", "=", "^", "!", "/",
      "*", "?", "&", "<", ">", "(", ")", "[", "]", "{",
      "}", "@", "%", "$", "#"
    ],

    encode: function(bytes) {
      var size = bytes.length;
      var str = "";
      var byte_nbr = 0;
      var char_nbr = 0;
      var value = 0;

      while (byte_nbr < size) {
        value = ((value << 8) >>> 0) + bytes[byte_nbr++];
        if (byte_nbr % 4 == 0) {
          // Output value in base 85
          var divisor = 52200625;//85 * 85 * 85 * 85;
          while (divisor > 0) {
            var idx = ((value/divisor) >>> 0) % 85;
            str += EncDec.z85.fwdTable_[idx];
            divisor = (divisor/85) >>> 0;
          }
        }
      }

      return str;
    }
  }

  return EncDec;
}));
