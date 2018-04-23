
const _ = require("lodash");

const { User } = require("../models/user");

const getUsersList = (req, res, next) => {
  User.find(
    {},
    "email  avatar  name  role  created  lastEntered",
    (err, users) => {
      res.json(users);
    }
  );
};

const newUser = (req, res, next) => {
  const error = new Error("Незаполнен логин или пароль");
  error.status = 401;

  let { email, password } = req.body;
console.log('email, password: ', email, password);

  if (email && password) {
    User.createNew(email, password, req.body, (err, user) => {
      if (err) return next(err);
      res.json({ user });
    });
  } else {
    return next(error);
  }
};

const changeUser = (req, res, next) => {
  const error = new Error("Незаполнен ид пользователя");
  error.status = 401;

  let { _id } = req.body;

  if (_id) {
    User.findById(_id, (err, user) => {
      if (err) return next(err);
      if (!user) return next("Пользователь не найден");

      _.each(req.body, (el, idx) => {
        if (idx !== "_id") user[idx] = el;
      });

      user.save(err => {
        if (err) return next(err);
        user.hashedPassword = undefined;
        user.salt = undefined;
        res.json({ user });
      });
    });
  } else {
    return next(error);
  }
};


module.exports = {
    getUsersList,
    newUser,
    changeUser
  };