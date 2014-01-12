var tv = [
  { 'm': "", 'h': "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" },
  { 'm': "The quick brown fox jumps over the lazy dog", 'h': "d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592" },
  { 'm': "The quick brown fox jumps over the lazy dog.", 'h': "ef537f25c895bfa782526529a9b63d97aa631564d5d789c2b765448c8635fb6c" }
];



function factoryTestSHA256(test_vector) {
  return function() {
    var m = EncDec.ascii.decode(test_vector.m);
    var h = EncDec.hex.encode(Sha256.hash(m));
    equal(h.toLowerCase(), test_vector.h, "Correct hash: "+test_vector.h);
  };
}

for (var idx in tv) {
  test("SHA256 vector "+idx, factoryTestSHA256(tv[idx]));
}
