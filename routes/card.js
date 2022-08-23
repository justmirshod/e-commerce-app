const { Router } = require("express");
const router = Router();
const Notebooks = require("../models/Notebooks");

function mapCart(cart) {
  return cart.items.map((m) => ({
    ...m.notebookId._doc,
    id: m.notebookId.id,
    count: m.count,
  }));
}

function computePrice(notebooks) {
  return notebooks.reduce((total, notebook) => {
    return (total += notebook.price * notebook.count);
  }, 0);
}

router.get("/", async (req, res) => {
  const user = await req.user.populate("cart.items.notebookId");
  const notebooks = mapCart(user.cart);

  res.render("card", {
    title: "Basket",
    isBasket: true,
    notebooks,
    price: computePrice(notebooks),
  });
});

router.post("/add", async (req, res) => {
  const notebook = await Notebooks.findById(req.body.id);
  await req.user.addToCart(notebook);
  res.redirect("/card");
});

router.delete("/remove/:id", async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  const user = await req.user.populate("cart.items.notebookId");
  const notebooks = mapCart(user.cart);
  const cart = {
    notebooks,
    price: computePrice(notebooks),
  };

  res.status(200).json(cart);
});
module.exports = router;
