module.exports = {
  xsollaLogin
};

const request = require("request");

const { User } = require("../models/user");

function xsollaLogin(req, res, next) {
  let { user, token, project } = req.query;

  request("http://www.google.com", (error, response, body) => {
    if (error) {
      const err = new Error("Пользователь не авторизован");
      err.status = 403;
      return next(err);
    }

    User.findOne(
      { xsollaUserId: user, xsollaProject: project },
      (err, xUser) => {
        if (!xUser) {
          xUser = new User({ xsollaUserId: user, xsollaProject: project });
        }
        xUser.token = token;
        xUser.save(err => {
          if (err) return next(err);
          req.logIn(user, function(error) {
            if (error) console.log("logIn err: ", error);
            return error ? next(err) : res.redirect ("/");
          });
        });
      }
    );
  });
}
