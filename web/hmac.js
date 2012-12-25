HMAC = function(hash) {
  // hash object needs to respond to:
  //  - blockSize() => block size of hash in bytes
  //  - hash(byteArray) => hashed byte array
  //  - digestSize() => digest size in bits
  //
  //  HMAC object responds to:
  //  - blockSize() => block size in bits
  //  - setup(key as byte array)
  //  - encrypt(msg as byte array) => ciphertext as byte array

  this.hash_      = hash;
  this.blockSize_ = hash.blockSize();

  this.ipad_ = new Array(this.blockSize_);
  this.opad_ = new Array(this.blockSize_);

  for (var i = 0; i < this.blockSize_; i += 1) {
    this.ipad_[i] = 0x36;
    this.opad_[i] = 0x5c;
  }

  this.xorPad_ = function(k, pad) {
    var len = Math.min(k.length, pad.length);
    var o = pad.slice();
    for (var i = 0; i < len; i++)
      o[i] ^= k[i] & 0xFF;

    return o;
  };

  this.setup = function(k) {
    if (k.length > this.blockSize_)
      k = this.hash_.hash(k);
    this.ipadK_ = this.xorPad_(k, this.ipad_);
    this.opadK_ = this.xorPad_(k, this.opad_);
  };

  this.encrypt = function(m) {
    var h1 = this.hash_.hash(this.ipadK_.slice().concat(m));
    var h2 = this.hash_.hash(this.opadK_.slice().concat(h1));

    return h2;
  };

  this.blockSize = function() {
    return this.hash_.digestSize();
  };
};
