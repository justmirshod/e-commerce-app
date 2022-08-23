const { Router } = require("express");
const router = Router();
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const { registerValidators } = require("../utils/validators");

router.get("/login", (req, res) => {
  res.render("auth/login", {
    title: "Register",
    isLogin: true,
    error: req.flash("error"),
    loginError: req.flash("loginError"),
    passwordError: req.flash("passwordError"),
  });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      const samePass = await bcrypt.compare(password, candidate.password);
      if (samePass) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save((err) => {
          if (err) throw err;

          res.redirect("/");
        });
      } else {
        req.flash("passwordError", "Wrong password entered, please try again!");
        res.redirect("/auth/login#login");
      }
    } else {
      req.flash("loginError", "This user is not defined, please try again!");
      res.redirect("/auth/login#login");
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/register", registerValidators, async (req, res) => {
  try {
    const { email, password, name, confirm } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array()[0].msg);
      return res.status(422).redirect("/auth/login#register");
    }

    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      email: email,
      name: name,
      password: hash,
      cart: { items: [] },
    });
    await user.save();
    res.redirect("/auth/login#login");
  } catch (e) {
    console.log(e);
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login#login");
  });
});

module.exports = router;
