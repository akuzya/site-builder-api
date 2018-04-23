const express = require("express");
const router = express.Router();
const passport = require("passport");

const { checkRole, getMe } = require("../libs/auth.js");
const { fileUpload } = require("../libs/file");

const { getUsersList, newUser, changeUser } = require("../workers/users");
const { getHTML } = require("../workers/createHTML");

const { getParts, setPart } = require("../workers/parts");
const {
  getStructure,
  addPart,
  partsSwapPossition,
  deleteParts,
  removeParts,
  restoreParts,
  saveParts
} = require("../workers/structures");

function login(req, res, next) {
  console.log("req.body: ", req.body);

  const err = new Error("Пользователь не авторизован");
  err.status = 403;

  passport.authenticate("local", function(error, user, info) {
    console.log("user, info: ", error, user, info);

    if (error || !user) console.log("authenticate err: ", user, error);
    if (error || !user) return next(err);

    req.logIn(user, function(error) {
      if (error) console.log("logIn err: ", error);
      return error ? next(err) : res.json({ error, user });
    });
  })(req, res, next);
}

function logout(req, res) {
  req.logout();
  res.json({ error: null });
}


router.post("/login", login);
router.get("/logout", logout);
router.get("/getme", getMe);

router.get("/getuserslist", checkRole("administrator"), getUsersList);
router.post("/newuser", checkRole("administrator"), newUser);
router.post("/updateuser", checkRole("administrator"), changeUser);


// router.get("/getparts", checkRole(), getParts);
// router.post("/setpart", checkRole("administrator"), setPart);
router.get("/getparts", getParts);
router.post("/setpart", setPart);

router.get("/getstructure", getStructure);
router.post("/addpart", addPart);
router.post("/partsswap", partsSwapPossition);
router.post("/deleteparts", deleteParts);
router.post("/removeparts", removeParts);
router.post("/restoreparts", restoreParts);
router.post("/saveparts", saveParts);

router.get("/createhtml", getHTML);

router.post("/fileupload", fileUpload);



module.exports = router;
