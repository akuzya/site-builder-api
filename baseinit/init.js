const { User } = require("../models/user");
const { Structure } = require("../models/structure");
const { Part } = require("../models/part");

const async = require("async");
const _ = require('lodash');

const initUsersArray = require("../data/users.json");

async.each(
  initUsersArray,
  (el, next) => {
    User.findOne({ email: el.email }, (err, user) => {
      console.log("err, user: ", err, user);

      if (!user) {
        console.log("el.email, el.password: ", el.email, el.password);

        User.createNew(el.email, el.password, el, (err, usr) => {
            console.log("create new admin: ", usr);
          next();
        });
      } else return next();
    });
  },
  err => {
  }
);

function createStruct() {
  const initValues = require("../data/structures.json");

  Structure.findOne({}, (err, struct) => {
    if (!struct) {
      _.each(initValues, el => {
        struct = new Structure({
          project: el.project,
          globalValues: el.globalValues
        });
        async.each(
          el.parts,
          (el2, next) => {
            Part.findOne({ name: el2.part }, (err, part) => {
              el2.part = part._id;
              struct.parts.push(el2);
              next();
            });
          },
          err => {
            console.log("structs created");
            struct.save();
          }
        );
      });
    }
  });
}

const initValues = require("../data/parts.json");

Part.findOne({}, (err, part) => {
  if (!part) {
    async.each(
      initValues,
      (el, next) => {
        part = new Part(el);
        part.save(err => next());
      },
      err => {
        console.log("parts created");
        createStruct();
      }
    );
  } else createStruct();
});
