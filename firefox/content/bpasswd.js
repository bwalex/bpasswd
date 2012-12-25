BPasswd = {
  generate: function(salt, password, cost) {
    if (typeof(cost) === "undefined")
      cost = 6;

    var h = new HMAC(Sha256);
    var b = new BCrypt();

    var k = EncDec.ascii.decode(password);
    var s = EncDec.ascii.decode(salt);

    h.setup(Sha256.hash(k));
    s = h.encrypt(s);

    var c = b.bcrypt(cost, s, k);
    return EncDec.base64.encode(c);
  }
};
