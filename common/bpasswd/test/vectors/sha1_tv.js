var tv = [
  { 'm': "", 'h': "da39a3ee5e6b4b0d3255bfef95601890afd80709" },
  { 'm': "The quick brown fox jumps over the lazy dog", 'h': "2fd4e1c67a2d28fced849ee1bb76e7391b93eb12" },
  { 'm': "The quick brown fox jumps over the lazy cog", 'h': "de9f2c7fd25e1b3afad3e85a0bd17d9b100db4b3" }
];



function factoryTestSHA1(test_vector) {
  return function() {
    var m = EncDec.ascii.decode(test_vector.m);
    var h = EncDec.hex.encode(Sha1.hash(m));
    equal(h.toLowerCase(), test_vector.h, "Correct hash: "+test_vector.h);
  };
}

for (var idx in tv) {
  test("SHA-1 vector "+idx, factoryTestSHA1(tv[idx]));
}
