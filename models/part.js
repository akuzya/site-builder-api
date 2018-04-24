const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const _ = require("lodash");

const schema = new Schema({
  name: {
    type: String
  },
  template: { type: String },
  fields: [
    {
      name: { type: String },
      type: { type: String },
      schem: { type: Schema.Types.Mixed },
      default: { type: Schema.Types.Mixed },
      range: { type: Schema.Types.Mixed },
      style: { type: String },
      className: { type: String }
    }
  ]
});

const Part = (exports.Part = mongoose.model("Part", schema));

