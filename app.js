const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const User = require("./models/user");
const MongoConnect = require("./util/database").MongoConnect;

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(async (res, req, next) => {
  const user = await User.findById("6359bee38d827a59dca4913c");

  res.user = new User(user.name, user.email, user.cart, user._id);
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

MongoConnect(() => {
  app.listen(3000);
});
