const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  console.log(req.session);
  res.render("index", { title: "Home", isHome: true });
});

module.exports = router;
