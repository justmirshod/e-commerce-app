const { Router } = require("express");
const router = Router();
const Order = require("../models/Order");

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({ "user.userId": req.user._id }).populate(
      "user.userId"
    );
    res.render("orders", {
      isOrder: true,
      title: "Orders",
      orders: orders.map((item) => ({
        ...item._doc,
        price: item.notebooks.reduce((total, c) => {
          return (total += c.count * c.notebook.price);
        }, 0),
        date: new Intl.DateTimeFormat("us-US", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(item.date),
      })),
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/", async (req, res) => {
  try {
    const user = await req.user.populate("cart.items.notebookId");
    const notebooks = user.cart.items.map((item) => ({
      count: item.count,
      notebook: { ...item.notebookId._doc },
    }));
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user._id,
      },
      notebooks,
    });

    await order.save();
    req.user.cleanCart();
    res.redirect("/order");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
