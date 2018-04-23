const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const _ = require("lodash");
const async = require("async");

const { Part } = require("./part");

const schema = new Schema({
  project: { type: String, index: true },
  globalValues:[{
    key: { type: String },
    value: { type: Schema.Types.Mixed }
  }],
  globalStyles:{ type: Schema.Types.Mixed },
  parts: [
    {
      idx: { type: Number },
      deleted: { type: Boolean },
      part: { type: mongoose.Schema.ObjectId, ref: "Part" },
      values: [
        {
          key: { type: String },
          value: { type: Schema.Types.Mixed }
        }
      ],
      styles:{ type: Schema.Types.Mixed }
    }
  ]
});

const Structure = (exports.Structure = mongoose.model("Structure", schema));

const initValues = require("../data/structures.json");

setTimeout(() => {
  Structure.findOne({}, (err, struct) => {
    if (!struct) {
      _.each(initValues, el => {
        struct = new Structure();
          async.each(
            el.parts,
            (el2, next) => {
              Part.findOne({ name: el2.part }, (err, part) => {
                el2.part = part;
                struct.parts.push(el2);
                next();
              });
            },
            err => {
              struct.save();
            }
          );
        });
    }
  });
}, 600);
