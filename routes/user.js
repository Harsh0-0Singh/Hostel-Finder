const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl, checkRole}= require("../middleware.js");
const { signup, renderSignupForm, renderLoginForm, login, logout, renderHomepage, searchHome } = require("../controllers/users.js");

router.route("/")
.get(renderHomepage);
router.route("/get")
.get(wrapAsync(searchHome));

router.route("/signup")
.get( renderSignupForm)
.post(wrapAsync(signup)
);

router.route("/login")
.get(renderLoginForm)
.post(
  saveRedirectUrl,
  checkRole,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  login
);

router.get("/logout",logout);

module.exports = router;
