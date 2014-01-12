var tv = [
  { "p": "Man", "b64": "TWFu" },
  { "p": "pleasure.", "b64": "cGxlYXN1cmUu" },
  { "p": "leasure.", "b64": "bGVhc3VyZS4=" },
  { "p": "easure.", "b64": "ZWFzdXJlLg==" },
  { "p": "asure.", "b64": "YXN1cmUu" }
];

function factoryTestEnc(test_vector) {
  return function() {
    var a = EncDec.ascii.decode(test_vector.p);
    var b = EncDec.base64.encode(a);

    equal(b, test_vector.b64, "Correct base64: "+test_vector.b64);
  };
}


function factoryTestDec(test_vector) {
  return function() {
    var b = test_vector.b64;

    var a = EncDec.base64.decode(b);
    var p = EncDec.ascii.encode(a);

    equal(p, test_vector.p, "Correct text: "+test_vector.p);
  };
}


for (var idx in tv) {
  test("Base64 Encode vector "+idx, factoryTestEnc(tv[idx]));
}


for (var idx in tv) {
  test("Base64 Decode vector "+idx, factoryTestDec(tv[idx]));
}
