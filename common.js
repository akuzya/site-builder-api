module.exports = {
  addExpressMiddleware,
  CORSMiddleware
};

// pnpm install -S mongoose
// pnpm install -S express-session
// pnpm install -S passport
// pnpm install -S passport-local
// pnpm install -S multer
// pnpm install -S connect-mongo
// pnpm install -S mime
// pnpm install -S helmet

const mongoose = require("mongoose");
const session = require("express-session");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const helmet = require("helmet");
const crypto = require("crypto");
const mime = require("mime");

// wl.emails

let config = require("./config");

const multer = require("multer");
const fs = require("fs");
const path = require("path");

fs.access(
  path.join(__dirname, config.multer.dest),
  fs.constants.R_OK | fs.constants.W_OK,
  err => {
    if (err)
      fs.mkdir(path.join(__dirname, config.multer.dest), err =>
        console.log(
          err
            ? err
            : `direct create ${path.join(__dirname, config.multer.dest)}`
        )
      );
  }
);

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, config.multer.dest));
  },
  filename: function(req, file, cb) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      cb(
        null,
        raw.toString("hex") + Date.now() + "." + mime.extension(file.mimetype)
      );
    });
  }
});

const upload = multer({ storage });

const mConnection = mongoose.connect(config.mongoUrl);

const MongoStore = require("connect-mongo")(session);

const User = require("./models/user.js").User;

config.session.store = new MongoStore({
  mongooseConnection: mongoose.connection
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    User.authorize.bind(User)
  )
);

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if (err) return done(err);
    return done(null, user);
  });
});

function CORSMiddleware(app) {
  app.use(function(req, res, next) {
    let origin = req.get("Origin");
    let host = req.get("host");

    // console.log('host: ', host );
    // console.log('origin : ', origin );

    // res.header(
    //   "Access-Control-Allow-Origin",
    //   `http://localhost:3000`
    // );

    res.header(
      "Access-Control-Allow-Origin",
      host || origin ? `http://${host}` || origin  : "*"
    );

    res.header(
      "Access-Control-Allow-Methods",
      "DELETE GET HEAD POST PUT OPTIONS TRACE"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    );
    res.header("Access-Control-Allow-Credentials", "true");

    next();
  });
}

function addExpressMiddleware(app) {
  app.use(session(config.session));
  //   app.use(helmet());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(upload.single("file"));
}
