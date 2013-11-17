BCrypt = function() {
  this.magic_ = new Array(24);
  this.bfCtx_ = undefined;

  for (var i = 0; i < 24; i++)
    this.magic_[i] = "OrpheanBeholderScryDoubt".charCodeAt(i);


  this.eksBlowfishSetup_ = function(cost, salt, key) {
    var n = 1 << cost; //Math.pow(2,cost);
    this.bfCtx_ = new Blowfish();
    this.bfCtx_.eksExpandKey(salt, key);
    for (var i = 0; i < n; i++) {
      // Paper says that salt is expanded first, and then the key.
      // The OpenBSD C implementation expands the key first, then
      // the salt - so let's do it the same way as the (only)
      // practical implementation.
      this.bfCtx_.setup(key);
      this.bfCtx_.setup(salt);
    }
  };


  this.bcrypt = function(cost, salt, pwd) {
    this.eksBlowfishSetup_(cost, salt, pwd);
    var ctext = this.magic_.slice();

    for (var i = 0; i < 64; i += 1)
      ctext = this.bfCtx_.encrypt(ctext);

    return ctext;
  };
};
