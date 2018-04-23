var babel = require("babel-core");

const path = require("path");
const fs = require("fs");

let p = path.join("../client/src/parts/Footer.js");
console.log("p: ", p);

fs.readFile(p, (err, data) => {
  let { code } = babel.transform(data.toString(), {
    presets: ["env", "stage-2", "react"],
    plugins: ["transform-react-jsx"]
  });
//   console.log("a: ", code);
  fs.writeFile("./footer.js", code, err => console.log("err: ", err));
});

// babel.transformFile(p, {presets:["env","stage-2","react"],plugins:["transform-react-jsx"]},(err,result)=>{
//     console.log('err: ', err);

//     console.log('result.code: ', result.code);

// });
// // ,plugins:["transform-react-jsx"]
