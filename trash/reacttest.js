const { renderToString } = require("react-dom/server");
var react = require('react');
var babel = require("babel-core");

// const p = require('./PartsFooter.js').default;
// console.log('p: ', p);


// var PartsFooter = react.createFactory(p);

// console.log('PartsFooter: ', PartsFooter);

const path = require("path");
const fs = require("fs");

let p = path.join(__dirname,"../../client/src/parts/Footer.js");
console.log("p: ", p);

fs.readFile(p, (err, data) => {
    
  let { code } = babel.transform(data.toString(), {
    presets: ["env", "stage-2", "react"],
    plugins: ["transform-react-jsx"]
  });

  let PartsFooter = eval(code);

  var props = {
    adress:"dgdgdg",
    copyright:"dddddddddddddddddddddd"
  }

let a = renderToString(PartsFooter(props));
// console.log('PartsFooter: ', PartsFooter);

console.log('a: ', a);


});




