module.exports = {
  getProjects,
  newProject,
  deleteProject
};

const { Project } = require("../models/project");

function getProjects(req, res, next) {
  let { page = 0, count = 10 } = req.query;
  Project.find({ owner: req.user, deleted: false })
    .limit(count)
    .skip(+page * +count)
    .exec((err, projects) => {
      res.json({ projects });
    });
}

function newProject(req, res, next) {
  let { name, comment } = req.body;

  let project = new Project({ name, comment, owner: req.user });
  project.save(err => {
    res.json({ project });
  });
}

function deleteProject(req, res, next) {
  let { _id } = req.body;
  if (!_id) {
    let error = new Error("Не задан ид проекта");
    error.status = 401;
    return next(error);
  }

  Project.updateOne({ _id }, { $set: { deleted: true } }, error => {
    return error ? next(error) : res.json({ error });
  });
}
