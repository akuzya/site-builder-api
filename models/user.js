var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var crypto = require("crypto");
var async = require("async");
var _ = require("lodash");
var config = require("../config.js");

var debug = require("debug")("server:server");

var schema = new Schema({
  xsollaUserId:{
    type: String,
    index: true
  },
  xsollaToken:{
    type: String
  },
  email: {
    type: String,
    index: true
  },
  avatar: {
    type: String,
    default: "/uploads/defaultuser.jpg"
  },
  name: {
    type: String
  },
  role: {
    type: String,
    required: true,
    index: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  lastEntered: {
    type: Date,
    default: null
  }
});

schema.methods.encryptPassword = function(password) {
  return crypto
    .createHmac("sha1", this.salt)
    .update(config.appSalt)
    .update(password)
    .digest("hex");
};

schema
  .virtual("password")
  .set(function(password) {
    console.log("this: ", this);

    this._plainPassword = password;
    console.log("password: ", password);

    this.salt = Math.random() + "";
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._plainPassword;
  });

schema.methods.checkPassword = function(password) {
  return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.authorize = function(email, password, callback) {
  console.log('email, password: ', email, password);
  
  var User = this;

  async.waterfall(
    [
      function(done) {
        User.findOne({ email: email }, done);
      },
      function(user, done) {
        if (user) {
          if (user.checkPassword(password)) {
            user = user.toObject();
            delete user.hashedPassword;
            delete user.salt;

            done(null, user);
          } else {
            done("Пользователь не найден");
          }
        } else {
          done("Пользователь не найден");
        }
      }
    ],
    callback
  );
};

schema.statics.findOrCreate = function(query, callback) {
  console.log("arguments: ", arguments);
  console.log("query: ", query);
  var User = this;

  User.findOne(query, function(err, usr) {
    if (!usr) {
      query.password = query.password || "111";
      usr = new User(query);
      usr.save(err => callback(err, usr));
    } else return callback(null, usr);
  });
};

schema.statics.createNew = function(email, password, obj, callback) {
  var User = this;
  console.log(email, password, obj);

  async.waterfall(
    [
      function(done) {
        User.findOne({ email: email }, function(err, usr) {
          done(null, usr);
        });
      },
      function(user, done) {
        if (user) {
          done("Пользователь с таким email существует");
        } else {
          user = new User(obj);
          user.save(function(err) {
            console.log('err: ', err);
            
            if (err) return callback(err);

            // console.log('user: ', user);

            if (user) {
              user = user.toObject();
              delete user.hashedPassword;
              delete user.salt;
            }

            done(null, user);
          });
        }
      }
    ],
    function(err, user) {
      callback(err, user);
    }
  );
};

const User = exports.User = mongoose.model("User", schema);

const initUsersArray = require("../data/users.json");

async.each(
  initUsersArray,
  (el, next) => {
    User.findOne({ email: el.email }, (err, user) => {
      console.log('err, user: ', err, user);
      
      if (!user) {
        console.log('el.email, el.password: ', el.email, el.password);
        
        User.createNew(el.email, el.password, el, (err, usr) => {
          debug("create new admin: ", usr);
          next();
        });
      } else return next();
    });
  },
  err => {
    // debug("init user list: ", _.map(initUsersArray, "email"));
  }
);
