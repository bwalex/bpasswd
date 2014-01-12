/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  SHA-1 implementation in JavaScript | (c) Chris Veness 2002-2010 | www.movable-type.co.uk      */
/*   - see http://csrc.nist.gov/groups/ST/toolkit/secure_hashing.html                             */
/*         http://csrc.nist.gov/groups/ST/toolkit/examples.html                                   */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Sha1 = {};  // Sha1 namespace

/**
 * Generates SHA-1 hash of byte array
 *
 * @param {Array} msg                Byte array to be hashed
 * @returns {Array}                  Hash of msg as byte array
 */
Sha1.hash = function(msg) {
  // constants [§4.2.1]
  var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];

  // PREPROCESSING

  msg = msg.slice();
  msg.push(0x80);  // add trailing '1' bit (+ 0's padding) to string [§5.1.1]

  // convert string msg into 512-bit/16-integer blocks arrays of ints [§5.2.1]
  var l = msg.length/4 + 2;  // length (in 32-bit integers) of msg + ‘1’ + appended length
  var N = Math.ceil(l/16);   // number of 16-integer-blocks required to hold 'l' ints
  var M = new Array(N);

  for (var i=0; i<N; i++) {
    M[i] = new Array(16);
    for (var j=0; j<16; j++) {  // encode 4 chars per integer, big-endian encoding
      M[i][j] = (msg[i*64+j*4]<<24) | (msg[i*64+j*4+1]<<16) |
        (msg[i*64+j*4+2]<<8) | (msg[i*64+j*4+3]);
    } // note running off the end of msg is ok 'cos bitwise ops on NaN return 0
  }
  // add length (in bits) into final pair of 32-bit integers (big-endian) [§5.1.1]
  // note: most significant word would be (len-1)*8 >>> 32, but since JS converts
  // bitwise-op args to 32 bits, we need to simulate this by arithmetic operators
  M[N-1][14] = ((msg.length-1)*8) / Math.pow(2, 32); M[N-1][14] = Math.floor(M[N-1][14])
  M[N-1][15] = ((msg.length-1)*8) & 0xffffffff;

  // set initial hash value [§5.3.1]
  var H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

  // HASH COMPUTATION [§6.1.2]

  var W = new Array(80); var a, b, c, d, e;
  for (var i=0; i<N; i++) {

    // 1 - prepare message schedule 'W'
    for (var t=0;  t<16; t++) W[t] = M[i][t];
    for (var t=16; t<80; t++) W[t] = Sha1.ROTL(W[t-3] ^ W[t-8] ^ W[t-14] ^ W[t-16], 1);

    // 2 - initialise five working variables a, b, c, d, e with previous hash value
    a = H[0]; b = H[1]; c = H[2]; d = H[3]; e = H[4];

    // 3 - main loop
    for (var t=0; t<80; t++) {
      var s = Math.floor(t/20); // seq for blocks of 'f' functions and 'K' constants
      var T = (Sha1.ROTL(a,5) + Sha1.f(s,b,c,d) + e + K[s] + W[t]) & 0xffffffff;
      e = d;
      d = c;
      c = Sha1.ROTL(b, 30);
      b = a;
      a = T;
    }

    // 4 - compute the new intermediate hash value
    H[0] = (H[0]+a) & 0xffffffff;  // note 'addition modulo 2^32'
    H[1] = (H[1]+b) & 0xffffffff;
    H[2] = (H[2]+c) & 0xffffffff;
    H[3] = (H[3]+d) & 0xffffffff;
    H[4] = (H[4]+e) & 0xffffffff;
  }

  return EncDec.word32.decode(H);
}

//
// function 'f' [§4.1.1]
//
Sha1.f = function(s, x, y, z)  {
  switch (s) {
  case 0: return (x & y) ^ (~x & z);           // Ch()
  case 1: return x ^ y ^ z;                    // Parity()
  case 2: return (x & y) ^ (x & z) ^ (y & z);  // Maj()
  case 3: return x ^ y ^ z;                    // Parity()
  }
}

//
// rotate left (circular left shift) value x by n positions [§3.2.5]
//
Sha1.ROTL = function(x, n) { return (x<<n) | (x>>>(32-n)); }

Sha1.blockSize = function() { return 64 };
Sha1.digestSize = function() { return 160 };
