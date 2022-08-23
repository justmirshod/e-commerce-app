const { Schema, model } = require("mongoose");
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: String,
  avatarUrl: String,
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1,
        },
        notebookId: {
          type: Schema.Types.ObjectId,
          ref: "Notebooks",
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (notebook) {
  let items = [...this.cart.items];
  const idx = items.findIndex((item) => {
    return item.notebookId.toString() === notebook._id.toString();
  });
  if (idx >= 0) {
    items[idx].count = items[idx].count + 1;
  } else {
    items.push({
      notebookId: notebook._id,
      count: 1,
    });
  }

  this.cart = { items };

  return this.save();
};

userSchema.methods.removeFromCart = function (id) {
  let items = [...this.cart.items];
  const idx = items.findIndex((m) => {
    return m.notebookId.toString() === id.toString();
  });

  if (items[idx].count === 1) {
    items = items.filter((m) => m.notebookId.toString() !== id.toString());
  } else {
    items[idx].count--;
  }

  this.cart = { items };
  return this.save();
};

userSchema.methods.cleanCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = model("User", userSchema);
