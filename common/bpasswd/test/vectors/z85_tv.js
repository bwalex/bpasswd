var tv = [
  {
    "p": "\xBB\x88\x47\x1D\x65\xE2\x65\x9B" +
         "\x30\xC5\x5A\x53\x21\xCE\xBB\x5A" +
         "\xAB\x2B\x70\xA3\x98\x64\x5C\x26" +
         "\xDC\xA2\xB2\xFC\xB4\x3F\xC5\x18",
    "z85": "Yne@$w-vo<fVvi]a<NY6T1ed:M$fCG*[IaLV{hID"
  },
  {
    "p": "\x7B\xB8\x64\xB4\x89\xAF\xA3\x67" +
         "\x1F\xBE\x69\x10\x1F\x94\xB3\x89" +
         "\x72\xF2\x48\x16\xDF\xB0\x1B\x51" +
         "\x65\x6B\x3F\xEC\x8D\xFD\x08\x88",
    "z85": "D:)Q[IlAW!ahhC2ac:9*A}h:p?([4%wOTJ%JR%cs"
  },
  {
    "p": "\x54\xFC\xBA\x24\xE9\x32\x49\x96" +
         "\x93\x16\xFB\x61\x7C\x87\x2B\xB0" +
         "\xC1\xD1\xFF\x14\x80\x04\x27\xC5" +
         "\x94\xCB\xFA\xCF\x1B\xC2\xD6\x52",
    "z85": "rq:rM>}U?@Lns47E1%kR.o@n%FcmmsL/@{H8]yf7"
  },
  {
    "p": "\x8E\x0B\xDD\x69\x76\x28\xB9\x1D" +
         "\x8F\x24\x55\x87\xEE\x95\xC5\xB0" +
         "\x4D\x48\x96\x3F\x79\x25\x98\x77" +
         "\xB4\x9C\xD9\x06\x3A\xEA\xD3\xB7",
    "z85": "JTKVSB%%)wK0E.X)V>+}o?pNmC{O&4W4b!Ni{Lh6"
  }
];

function factoryTestEnc(test_vector) {
  return function() {
    var a = EncDec.ascii.decode(test_vector.p);
    var b = EncDec.z85.encode(a);

    equal(b, test_vector.z85, "Correct base64: "+test_vector.z85);
  };
}


function factoryTestDec(test_vector) {
  return function() {
    var b = test_vector.z85;

    var a = EncDec.z85.decode(b);
    var p = EncDec.ascii.encode(a);

    equal(p, test_vector.p, "Correct text: "+test_vector.p);
  };
}


for (var idx in tv) {
  test("z85 Encode vector "+idx, factoryTestEnc(tv[idx]));
}


for (var idx in tv) {
  test("z85 Decode vector "+idx, factoryTestDec(tv[idx]));
}
