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

const defaultGlobalValues = [
  { key: "videoBackground", value: true },
  { key: "pictureBackground", value: false },
  { key: "video", value: "97236432794" },
  { key: "image", value: "746542765.jpg" },
  { key: "textColor", value: "rgba(33,33,45,1)" },
  { key: "accentColor", value: "rgba(133,33,145,0.7)" },
  { key: "bgColor", value: "rgba(0,0,0,0.3)" },
  { key: "buttonBorderRadius", value: 21 },
  { key: "languages", value: ["en", "ru", "cn"] }
];

function getStructure(req, res, next) {
  let { project } = req.query;

  if (!project) {
    const error = new Error("Не заполнен ид проекта");
    error.status = 401;
    return next(error);
  }

  Structure.findOne({ project }).exec((err, structure) => {
    if (!structure) {
      structure = new Structure({
        project,
        globalValues: defaultGlobalValues,
        parts: []
      });
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
  let { _id, part_id, part } = req.body;

  try {
    part = JSON.parse(part);
  } catch (e) {
    console.log("part json parse error: ", e);
  }

  Structure.findById(_id, (err, structure) => {
    let fIdx = structure.parts.findIndex(
      el => String(el._id) === String(part_id)
    );
    let tArr = [...structure.parts];
    tArr.splice(fIdx, 1, part);
    console.log("tArr: ", tArr);

    structure.parts = tArr;

    structure.markModified("parts");
    structure.save(error => res.json({ error, structure }));
  });
}
