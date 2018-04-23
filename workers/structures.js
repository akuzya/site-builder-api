module.exports = {
  getStructure,
  addPart,
  partsSwapPossition,
  deleteParts,
  removeParts,
  restoreParts,
  saveParts
};

const _ = require("lodash");

const { Structure } = require("../models/structure");
const { Part } = require("../models/part");

function getStructure(req, res, next) {
  let { _id } = req.query;

  if (!_id) {
    const error = new Error("Не заполнен ид проекта");
    error.status = 401;
    return next(error);
  }

  Structure.findOne({ project: _id }).exec((err, structure) => {
    if (!structure) {
      structure = new Structure({ project: _id, parts: [] });
      structure.save(error => res.json({ error, structure }));
    } else res.json({ error: null, structure });
  });
}

function addPart(req, res, next) {
  let { _id, part, idx = 0 } = req.body;
  if (!_id || !part) {
    const error = new Error("Не заполнен ид структуры или ид части");
    error.status = 401;
    return next(error);
  }

  Structure.findById(_id, (err, structure) => {
    // markModified

    _.each(structure.parts, el => {
      el.idx >= idx && el.idx++;
    });

    Part.findById(part, (err, fPart) => {
      let addPart = {
        idx: +idx,
        part,
        values: []
      };

      _.each(fPart.fields, el => {
        if (el.default) {
          addPart.values.push({
            key: el.name,
            value: el.default
          });
        }
      });

      structure.parts.push(addPart);
      structure.markModified("parts");
      structure.save(error => res.json({ error, structure }));
    });
  });
}

function partsSwapPossition(req, res, next) {
  const { _id, position1, position2 } = req.body;

  Structure.findById(_id, (err, structure) => {
    _.each(structure.parts, el => {
      if (el.idx === +position1) el.idx = +position2;
      else if (el.idx === +position2) el.idx = +position1;
    });

    structure.markModified("parts");
    structure.save(error => res.json({ error, structure }));
  });
}

function deleteParts(req, res, next) {
  const { _id, part_id } = req.body;

  Structure.findById(_id, (err, structure) => {
    _.each(structure.parts, el => {
      if (String(el._id) === String(part_id)) el.deleted = true;
    });

    structure.markModified("parts");
    structure.save(error => res.json({ error, structure }));
  });
}

function removeParts(req, res, next) {
  const { _id, part_id } = req.body;

  Structure.findById(_id, (err, structure) => {
    structure.parts = _.filter(structure.parts, el => {
      return String(el._id) !== String(part_id) || el.deleted !== true;
    });

    structure.markModified("parts");
    structure.save(error => res.json({ error, structure }));
  });
}

function restoreParts(req, res, next) {
  const { _id, part_id } = req.body;

  Structure.findById(_id, (err, structure) => {
    _.each(structure.parts, el => {
      if (String(el._id) === String(part_id)) el.deleted = false;
    });

    structure.markModified("parts");
    structure.save(error => res.json({ error, structure }));
  });
}

function saveParts(req, res, next) {
  const { _id, part_id, part } = req.body;

  Structure.findById(_id, (err, structure) => {
    _.each(structure.parts, el => {
      if (String(el._id) === String(part_id)) el = part;
    });

    structure.markModified("parts");
    structure.save(error => res.json({ error, structure }));
  });
}
