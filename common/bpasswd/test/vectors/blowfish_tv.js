var tv = [
{ "k": "0000000000000000", "p": "0000000000000000", "c": "4EF997456198DD78" },
{ "k": "FFFFFFFFFFFFFFFF", "p": "FFFFFFFFFFFFFFFF", "c": "51866FD5B85ECB8A" },
{ "k": "3000000000000000", "p": "1000000000000001", "c": "7D856F9A613063F2" },
{ "k": "1111111111111111", "p": "1111111111111111", "c": "2466DD878B963C9D" },
{ "k": "1111111111111111", "p": "0123456789ABCDEF", "c": "7D0CC630AFDA1EC7" },
{ "k": "0123456789ABCDEF", "p": "1111111111111111", "c": "61F9C3802281B096" },
{ "k": "0000000000000000", "p": "0000000000000000", "c": "4EF997456198DD78" },
{ "k": "FEDCBA9876543210", "p": "0123456789ABCDEF", "c": "0ACEAB0FC6A0A28D" },
{ "k": "7CA110454A1A6E57", "p": "01A1D6D039776742", "c": "59C68245EB05282B" },
{ "k": "0131D9619DC1376E", "p": "5CD54CA83DEF57DA", "c": "B1B8CC0B250F09A0" },
{ "k": "07A1133E4A0B2686", "p": "0248D43806F67172", "c": "1730E5778BEA1DA4" },
{ "k": "3849674C2602319E", "p": "51454B582DDF440A", "c": "A25E7856CF2651EB" },
{ "k": "04B915BA43FEB5B6", "p": "42FD443059577FA2", "c": "353882B109CE8F1A" },
{ "k": "0113B970FD34F2CE", "p": "059B5E0851CF143A", "c": "48F4D0884C379918" },
{ "k": "0170F175468FB5E6", "p": "0756D8E0774761D2", "c": "432193B78951FC98" },
{ "k": "43297FAD38E373FE", "p": "762514B829BF486A", "c": "13F04154D69D1AE5" },
{ "k": "07A7137045DA2A16", "p": "3BDD119049372802", "c": "2EEDDA93FFD39C79" },
{ "k": "04689104C2FD3B2F", "p": "26955F6835AF609A", "c": "D887E0393C2DA6E3" },
{ "k": "37D06BB516CB7546", "p": "164D5E404F275232", "c": "5F99D04F5B163969" },
{ "k": "1F08260D1AC2465E", "p": "6B056E18759F5CCA", "c": "4A057A3B24D3977B" },
{ "k": "584023641ABA6176", "p": "004BD6EF09176062", "c": "452031C1E4FADA8E" },
{ "k": "025816164629B007", "p": "480D39006EE762F2", "c": "7555AE39F59B87BD" },
{ "k": "49793EBC79B3258F", "p": "437540C8698F3CFA", "c": "53C55F9CB49FC019" },
{ "k": "4FB05E1515AB73A7", "p": "072D43A077075292", "c": "7A8E7BFA937E89A3" },
{ "k": "49E95D6D4CA229BF", "p": "02FE55778117F12A", "c": "CF9C5D7A4986ADB5" },
{ "k": "018310DC409B26D6", "p": "1D9D5C5018F728C2", "c": "D1ABB290658BC778" },
{ "k": "1C587F1C13924FEF", "p": "305532286D6F295A", "c": "55CB3774D13EF201" },
{ "k": "0101010101010101", "p": "0123456789ABCDEF", "c": "FA34EC4847B268B2" },
{ "k": "1F1F1F1F0E0E0E0E", "p": "0123456789ABCDEF", "c": "A790795108EA3CAE" },
{ "k": "E0FEE0FEF1FEF1FE", "p": "0123456789ABCDEF", "c": "C39E072D9FAC631D" },
{ "k": "0000000000000000", "p": "FFFFFFFFFFFFFFFF", "c": "014933E0CDAFF6E4" },
{ "k": "FFFFFFFFFFFFFFFF", "p": "0000000000000000", "c": "F21E9A77B71C49BC" },
{ "k": "0123456789ABCDEF", "p": "0000000000000000", "c": "245946885754369A" },
{ "k": "FEDCBA9876543210", "p": "FFFFFFFFFFFFFFFF", "c": "6B5C5A9C5D9E0A5A" }
];

function hexToLR(str) {
  var l, r;

  l = parseInt(str.substring(0, 8), 16);
  r = parseInt(str.substring(8,16), 16);

  return { l: l, r: r };
}

function lrToHex(l, r) {
  var str = "";
  var c;

  c = ((l >> 24) & 0xFF).toString(16);
  str += (c.length == 1) ? ("0"+c) : c;
  c = ((l >> 16) & 0xFF).toString(16);
  str += (c.length == 1) ? ("0"+c) : c;
  c = ((l >>  8) & 0xFF).toString(16);
  str += (c.length == 1) ? ("0"+c) : c;
  c = ((l      ) & 0xFF).toString(16);
  str += (c.length == 1) ? ("0"+c) : c;
  c = ((r >> 24) & 0xFF).toString(16);
  str += (c.length == 1) ? ("0"+c) : c;
  c = ((r >> 16) & 0xFF).toString(16);
  str += (c.length == 1) ? ("0"+c) : c;
  c = ((r >>  8) & 0xFF).toString(16);
  str += (c.length == 1) ? ("0"+c) : c;
  c = ((r      ) & 0xFF).toString(16);
  str += (c.length == 1) ? ("0"+c) : c;

  return str;
}


function factoryTestEncrypt(test_vector) {
  return function() {
    var bf = new Blowfish();
    var key = EncDec.hex.decode(test_vector.k);
    var lr = hexToLR(test_vector.p);

    bf.setup(key);
    var ct = bf.encipher(lr.l, lr.r);
    ct = lrToHex(ct.xl, ct.xr);

    equal(ct.toUpperCase(), test_vector.c, "Correct ciphertext: "+test_vector.c);
  };
}


function factoryTestDecrypt(test_vector) {
  return function() {
    var bf = new Blowfish();
    var key = EncDec.hex.decode(test_vector.k);
    var lr = hexToLR(test_vector.c);

    bf.setup(key);
    var pt = bf.decipher(lr.l, lr.r);
    pt = lrToHex(pt.xl, pt.xr);

    equal(pt.toUpperCase(), test_vector.p, "Correct plaintext: "+test_vector.p);
  };
}


function factoryTestEncryptECB(test_vector) {
  return function() {
    var bf = new Blowfish();
    var key = EncDec.hex.decode(test_vector.k);
    var pt = EncDec.hex.decode(test_vector.p);

    bf.setup(key);
    var ct = bf.encrypt(pt);
    ct = EncDec.hex.encode(ct);

    equal(ct.toUpperCase(), test_vector.c, "Correct ciphertext: "+test_vector.c);
  };
}


function factoryTestDecryptECB(test_vector) {
  return function() {
    var bf = new Blowfish();
    var key = EncDec.hex.decode(test_vector.k);
    var ct = EncDec.hex.decode(test_vector.c);

    bf.setup(key);
    var pt = bf.decrypt(ct);
    pt = EncDec.hex.encode(pt);

    equal(pt.toUpperCase(), test_vector.p, "Correct plaintext: "+test_vector.c);
  };
}


function factoryTestEncryptDecryptECBPad(test_vector) {
  return function() {
    var bf = new Blowfish(CryptoHelper.pads.pkcs7);
    var key = EncDec.hex.decode(test_vector.k);
    var pt = EncDec.hex.decode(test_vector.p);

    bf.setup(key);
    equal(pt.length,  8);
    var ct  = bf.encrypt(pt);
    equal(ct.length, 16); // 8 bytes of pt + 8 bytes of padding

    var pt2 = bf.decrypt(ct);
    pt2 = EncDec.hex.encode(pt2);

    equal(pt2.toUpperCase(), test_vector.p, "Correct plaintext: "+test_vector.p);
  };
}


for (var idx in tv) {
  test("Encrypt vector "+idx, factoryTestEncrypt(tv[idx]));
}

for (var idx in tv) {
  test("Decrypt vector "+idx, factoryTestDecrypt(tv[idx]));
}

for (var idx in tv) {
  test("Encrypt (ECB) vector "+idx, factoryTestEncryptECB(tv[idx]));
}

for (var idx in tv) {
  test("Decrypt (ECB) vector "+idx, factoryTestDecryptECB(tv[idx]));
}

for (var idx in tv) {
  test("Encrypt and decrypt ECB with PKCS7 padding, vector "+idx, factoryTestEncryptDecryptECBPad(tv[idx]));
}
