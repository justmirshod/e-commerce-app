const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const session = require("express-session");
const mongoStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const app = express();
const homeRoute = require("./routes/home");
const addRoute = require("./routes/add");
const notebooksRoute = require("./routes/notebooks");
const basketRoute = require("./routes/card");
const mongoose = require("mongoose");
const Handlebars = require("handlebars");
const ordersRoute = require("./routes/orders");
const authRoute = require("./routes/auth");
const auth = require("./middleware/auth");
const varMiddleware = require("./middleware/var.js");
const userMiddleware = require("./middleware/user");
const fileMiddleware = require("./middleware/file");
const errorPage = require("./middleware/error");
const profileRoute = require("./routes/profile");

const MONGODB_URI =
  "mongodb+srv://Misha:mirshod290804@cluster0.7pqhw.mongodb.net/shop?retryWrites=true&w=majority";

const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  helpers: require("./utils"),
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

const store = mongoStore({
  collection: "sessions",
  uri: MONGODB_URI,
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static("public"));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secret key",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use(fileMiddleware.single("avatar"));
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

app.use("/", homeRoute);
app.use("/add", auth, addRoute);
app.use("/notebooks", notebooksRoute);
app.use("/card", auth, basketRoute);
app.use("/order", auth, ordersRoute);
app.use("/auth", authRoute);
app.use("/profile", auth, profileRoute);

app.use(errorPage);

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server has started on port ${PORT}...`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
