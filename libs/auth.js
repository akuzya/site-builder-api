const { User } = require("../models/user.js");
const _ = require("lodash");

function lastEnter(user, next) {
  User.findById(user._id, (err, usr) => {
    usr.lastEntered = new Date();
    usr.save(err => next());
  });
}

module.exports = {
  getMe: function(req, res, next) {
    // console.log('role user: ', req.user.role);

    let user = _.assign({}, req.user && req.user._doc);

    user.hashedPassword = undefined;
    user.salt = undefined;

    res.json({ user });
  },
  checkRole: function(role) {
    const err = new Error("Пользователь не авторизован");
    err.status = 403;
    return (req, res, next) => {
      
      if (!req.user) return next(err);
      if (!role || !role.lenght)
        return req.isAuthenticated() ? lastEnter(req.user, next) : next(err);

      if (_.isArray(role)) {
        return _.find(role, usr => usr === req.user.role)
          ? lastEnter(req.user, next)
          : next(err);
      } else {
        return req.user.role === role ? lastEnter(req.user, next) : next(err);
      }
    };
  }
};
