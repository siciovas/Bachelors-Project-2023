/* eslint-disable no-undef */
export const outf = (text) => {
  console.log("Result:", text);
  var mypre = document.getElementById("output");
  mypre.value = mypre.innerHTML + text;
};

export const run = (code) => {
  console.log(code);
  Sk.pre = "output";
  Sk.configure({ output: outf });
  var compiledCode = Sk.importMainWithBody("<stdin>", false, code);
  Sk.misceval.asyncToPromise(function() {
    return Sk.misceval.callsim(compiledCode.$d.run, Sk.ffi.remapToPy([5, 5, 15, 15]));
  }).then(function(result) {
    console.log("labas")
    console.log(result);
    // compare output with expected output
    if (output === expectedOutput) {
      numPassed++;
    }
  }, function(err) {
    console.log(err.toString());
  });
};
