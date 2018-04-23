module.exports = {
  getParts,
  setPart
};

const _ = require("lodash");

const { Part } = require("../models/part");

function getParts(req, res, next) {
  Part.find({}).exec((err, parts) => {
    res.json({ parts });
  });
}

function setPart(req, res, next) {
  let { name } = req.body;
  Part.findOne({ name }).exec((err, part) => {
    if (!part) {
      part = new Part({ name });
    }
    _.each(req.body, (el, idx) => {
      part[idx] = el;
    });

    part.save(error => res.json({ error, part }));
  });
}
