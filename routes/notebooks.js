const { Router } = require("express");
const router = Router();
const Notebooks = require("../models/Notebooks");

router.get("/", async (req, res) => {
  try {
    const notebooks = await Notebooks.find().populate("userId");
    // const mapedNotebooks = notebooks.map((item) => {
    //   const isLive = item.userId.email === req.session.user.email;
    //   return {
    //     ...item._doc,
    //     isLive,
    //   };
    // });
    // console.log(mapedNotebooks);
    res.render("notebooks", {
      title: "Notebooks",
      isNotebooks: true,
      userId: req.user ? req.user._id.toString() : null,
      notebooks: notebooks,
    });
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id", async (req, res) => {
  console.log(req.params.id);
  const notebook = await Notebooks.findById(req.params.id);
  console.log(notebook);
  res.render("details", {
    title: `Notebook ${notebook.title}`,
    notebook,
    layout: "detail",
  });
});

router.get("/:id/edit", async (req, res) => {
  if (req.query.allow !== "allowed") {
    return res.redirect("/notebooks");
  }
  try {
    const notebook = await Notebooks.findById(req.params.id);
    if (notebook.userId.toString() !== req.user._id.toString()) {
      res.redirect("/notebooks");
    }
    res.render("notebook-edit", {
      title: `Edit ${notebook.title}`,
      notebook,
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/edit-notebook", async (req, res) => {
  const { id } = req.body;
  delete req.body.id;
  await Notebooks.findByIdAndUpdate(id, req.body);
  res.redirect("/notebooks");
});

router.post("/remove", async (req, res) => {
  try {
    await Notebooks.deleteOne({ _id: req.body.id });
    res.redirect("/notebooks");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
