(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['bcrypt', 'hmac', 'enc_dec', 'sha256'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory(require('./bcrypt'),
                                 require('./hmac'),
                                 require('./enc_dec'),
                                 require('./sha256'));
    } else {
        // Browser globals (root is window)
        root.BPasswd = factory(root.BCrypt,
                               root.HMAC,
                               root.EncDec,
                               root.Sha256);
    }
}(this, function (BCrypt, HMAC, EncDec, Sha256) {

  return {
    generate: function(salt, password, cost, gen_method) {
      if (typeof(cost) === "undefined")
        cost = 6;
      if (typeof(gen_method) === "undefined")
        gen_method = "base64";

      var h = new HMAC(Sha256);
      var b = new BCrypt();

      var k = EncDec.ascii.decode(password);
      var s = EncDec.ascii.decode(salt);

      h.setup(Sha256.hash(k));
      s = h.encrypt(s);

      var c = b.bcrypt(cost, s, k);
      return EncDec[gen_method].encode(c);
    }
  };
}));
