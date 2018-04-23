module.exports = {
  getHTML
};

const async = require("async");
const _ = require("lodash");
const { renderToString } = require("react-dom/server");
const react = require("react");
const babel = require("babel-core");
const path = require("path");
const fs = require("fs");
const Zip = require("node-native-zip");

const { Structure } = require("../models/structure");
// const { Part } = require("../models/part");

function getImage(value, images) {
  images.push(value);
  return `images/${value}`;
}

function mapObject(values, schema, images) {
  let tObj = {};
  _.each(schema, (el, idx) => {
    if (el === "Image") {
      tObj[idx] = getImage(values[idx], images);
    } else {
      tObj[idx] = values[idx];
    }
  });

  return tObj;
}

function createPart(part, values, images, done) {
  let p = path.join(__dirname, "../../client/src/parts", `${part.template}.js`);
  // console.log("p: ", p);

  // console.log(
  //   ": ",
  //   path.join(__dirname, "../node_modules", "babel-preset-env")
  // );

  let presets = [
    path.join(__dirname, "../node_modules", "babel-preset-env"),
    path.join(__dirname, "../node_modules", "babel-preset-react"),
    path.join(__dirname, "../node_modules", "babel-preset-stage-2")
  ];

  babel.transformFile(p, { presets }, (err, { code, map, ast }) => {
    console.log("code: ", code, map, ast);

    let component = eval(code); //NOSONAR
    var props = {};

    // _.each(values, el => {
    //   props[el.key] = el.value;
    // });
    _.each(part.fields, el => {
      let value = _.find(values, val => val.key === el.name);
      if (value) {
        if (el.type === "Image") {
          props[el.name] = getImage(value.value, images);
        } else if (el.type === "Array") {
          props[el.name] = _.map(value.value, arrayValue => {
            if (el.schem === "Image") {
              return getImage(arrayValue, images);
            } else if (typeof el.schem === "object" && el.schem !== null) {
              return mapObject(arrayValue, el.schem, images);
            } else return arrayValue;
          });
        } else if (el.type === "Object") {
          props[el.name] = mapObject(value.value, el.schem, images);
        } else {
          props[el.name] = value.value;
        }
      }
    });

    let htmlPart = renderToString(component(props));
    // console.log('PartsFooter: ', PartsFooter);

    done(htmlPart);
  });
}

function createHTML(parts, done) {
  let html = [
    "  <!DOCTYPE html>",
    '<html lang="ru">',
    "<head>",
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '<meta http-equiv="X-UA-Compatible" content="ie=edge">',
    "<title>Document</title>",
    "</head>",
    "<body>"
  ];

  let images = [];

  async.eachSeries(
    _.sortBy(parts, "idx"),
    (el, next) => {
      createPart(el.part, el.values, images, text => {
        html.push(text);
        next();
      });
    },
    err => {
      html.push("</body></html>");
      done(html.join(""), images);
    }
  );
}

function getHTML(req, res, next) {
  let { _id } = req.query;

  if (!_id) {
    let error = new Error("Не задан ид проекта");
    error.status = 401;
    return next(error);
  }

    Structure.findOne({ _id })
      .populate("parts.part")
      .exec((err, struct) => {
        createHTML(struct.parts, (html, images) => {
          createZip(html, images, zip => {
            res.set("Content-Type", "application/zip");
            res.set("Content-Disposition", "attachment; filename=site.zip");
            res.send(zip);
          });
        });
      });
}

function createZip(html, images, done) {
  const archive = new Zip();

  // console.log("images: ", _.uniq(images));

  archive.add("index.html", new Buffer(html, "utf8"));

  let arr = [];

  _.each(_.uniq(images), el => {
    arr.push({
      name: `images/${el}`,
      path: path.join(__dirname, "../uploads", el)
    });
  });

  archive.addFiles(arr, err => {
    if (err) return console.log("err while adding files", err);

    let buffer = archive.toBuffer();

    done(buffer);
  });
}

// getHTML(
//   { query: { _id: "5ad2f694cab0772f00755b88" } },
//   {
//     end: zip => {
//       fs.writeFile("react.zip", zip);
//     }
//   }
// );

// .populate({
//     path: 'structure',
//     select: 'contents header idx sections number level',
//     options: {
//         sort: { 'idx': 1 }
//     },
//     populate: {
//         path: 'sections',
//         match: {
//             parent: null
//         },
//         select: '_id'
//     }
// })
