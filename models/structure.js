const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const _ = require("lodash");
const async = require("async");

const { Part } = require("./part");

const schema = new Schema({
  project: { type: String, index: true },
  globalValues: [
    {
      key: { type: String },
      value: { type: Schema.Types.Mixed }
    }
  ],
  parts: [
    {
      idx: { type: Number },
      visible: { type: Boolean },
      part: { type: mongoose.Schema.ObjectId, ref: "Part" },
      values: [
        {
          key: { type: String },
          value: { type: Schema.Types.Mixed }
        }
      ],
      styles: { type: Schema.Types.Mixed }
    }
  ]
});

const Structure = (exports.Structure = mongoose.model("Structure", schema));

