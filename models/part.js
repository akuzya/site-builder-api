const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const _ = require("lodash");

const schema = new Schema({
  name: {
    type: String
  },
  template: { type: String },
  fields: [{ 
    name:{type: String },
    type:{type: String },
    schem:{type:Schema.Types.Mixed},
    default:{type:Schema.Types.Mixed},
    range:{type:Schema.Types.Mixed}
  }]
});

const Part = (exports.Part = mongoose.model("Part", schema));

const initValues = require("../data/parts.json");
  Part.findOne({}, (err, part) => {
    if (!part) {
        _.each(initValues, el => {
                part = new Part(el);
                part.save();
      });
    }
  });
