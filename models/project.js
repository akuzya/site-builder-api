const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const _ = require("lodash");

const { User } = require("./user");

const schema = new Schema({
  name: {
    type: String
  },
  comment: {
    type: String,
    default: ""
  },
  owner: { type: mongoose.Schema.ObjectId, ref: "User", index: true },
  deleted: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now
  }
});

const Project = (exports.Project = mongoose.model("Project", schema));

const initValues = require("../data/catalog.json");
setTimeout(() => {
  Project.findOne({}, (err, catalog) => {
    if (!catalog) {
        _.each(initValues, el => {
            User.findOne({email:el.owner},(err,user)=>{
                catalog = new Project(el);
                catalog.owner = user;
                catalog.save();
            });
      });
    }
  });
}, 300);
