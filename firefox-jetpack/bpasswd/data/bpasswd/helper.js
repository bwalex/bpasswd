CryptoHelper = {
  add: function(a,b) {
    var l = (a & 0xffff) + (b & 0xffff);
    var carry = (l >>> 16) & 0x01;
    var m = (a >>> 16) + (b >>> 16) + carry;
    return (m << 16) | (l & 0xffff);
  },

  xor: function(a,b) {
    var l = (a & 0xffff) ^ (b & 0xffff);
    var m = (a >> 16) ^ (b >> 16);
    return (m << 16) | (l & 0xffff);
  },

  or: function(a,b) {
    var l = (a & 0xffff) | (b & 0xffff);
    var m = (a >>> 16) | (b >>> 16);
    return (m << 16) | (l & 0xffff);
  },

  pads: {
    pkcs7: {
      // destructive padding.
      pad: function(pt, bsize) {
	bsize /= 8;
        var rem = pt.length % bsize;
        var nMissing = bsize;

        if (rem != 0)
          nMissing = bsize - rem;
        for (var i = 0; i < nMissing; i += 1)
          pt.push(nMissing);
        return pt;
      },

      unpad: function(pt, bsize) {
        var padBytes = pt[pt.length-1];

        return pt.slice(0,-padBytes);
      }
    },

    none: {
      pad: function(pt, bsize) { return pt; },
      unpad: function(pt, bsize) { return pt; }
    }
  }
};
