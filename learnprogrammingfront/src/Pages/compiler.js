/* eslint-disable no-undef */
export const outf = (text) => {
  var mypre = document.getElementById("output");
  mypre.value = mypre.innerHTML + text;
};
const builtinRead = (x) => {
  if (
    Sk.builtinFiles === undefined ||
    Sk.builtinFiles["files"][x] === undefined
  )
    throw "File not found: '" + x + "'";
  return Sk.builtinFiles["files"][x];
};

export const run = () => {
  var prog = document.getElementById("yourcode");
  console.log(prog.value);
  Sk.pre = "output";
  Sk.configure({ output: outf, read: builtinRead });
  var myPromise = Sk.misceval.asyncToPromise(function () {
    return Sk.importMainWithBody("<stdin>", false, prog.value, true);
  });
};
