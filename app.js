const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const dbStore = require("connect-mongodb-session")(session);

const errorController = require("./controllers/error");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const User = require("./models/user");
const mongoDbURI =
  "mongodb+srv://vlaluk352:vovakill441@study1.bz9oka3.mongodb.net/?retryWrites=true&w=majority";

const app = express();
const store = new dbStore({ uri: mongoDbURI, collection: "sessions" });

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: "secret", resave: false, saveUninitialized: false, store: store }));

app.use((req, res, next) => {
  User.findById("635c0a6b92f8931915085f09")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use(authRoutes);
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(mongoDbURI)
  .then(() => {
    // const user = new User({
    //   name: "vlaluk352",
    //   email: "vlaluk352@test",
    //   carts: { items: [] },
    // });
    // user.save();
    app.listen(3000);
  })
  .catch((err) => {});
