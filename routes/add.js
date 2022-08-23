const { Router } = require("express");
const router = Router();
const Notebooks = require("../models/Notebooks");
const { notebookValidators } = require("../utils/validators");
const { validationResult } = require("express-validator");

router.get("/", (req, res) => {
  res.render("add", { title: "Add notebook", isAdd: true });
});

router.post("/", notebookValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("add", {
      title: "Add notebook",
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        descr: req.body.descr,
      },
    });
  }
  const notebook = new Notebooks({
    title: req.body.title,
    price: req.body.price,
    img: req.body.img,
    descr: req.body.descr,
    userId: req.user,
  });
  try {
    await notebook.save();
    res.redirect("/notebooks");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
