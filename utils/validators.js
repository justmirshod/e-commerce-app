const { body } = require("express-validator");
const User = require("../models/User");

exports.registerValidators = [
  body("email")
    .isEmail()
    .withMessage("Enter your email correctly!")
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value.toLowerCase() });
        if (user) {
          return Promise.reject("This email is already exist");
        }
      } catch (e) {
        console.log(e);
      }
    })
    .normalizeEmail(),
  body("password", "Password shuold be at least six symbols")
    .isLength({
      min: 6,
      max: 56,
    })
    .isAlphanumeric()
    .trim(),
  body("confirm")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation should be similar to password");
      }

      return true;
    })
    .trim(),
  body("name")
    .isLength({ min: 3 })
    .withMessage("Name should have at least three symbols")
    .trim(),
];

exports.notebookValidators = [
  body("title")
    .isLength({ min: 3 })
    .withMessage("Notebook's title should have at least 3 symbols")
    .trim(),
  body("price").isNumeric().withMessage("Write correct price"),
  body("img").isURL().withMessage("Write correct URL"),
  body("descr")
    .isLength({ min: 10 })
    .withMessage("Description should have at least 10 symbols"),
];
