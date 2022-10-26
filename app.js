const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");

const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(async (req, res, next) => {
  const user = await User.findAll({
    where: {
      id: 1,
    },
  });

  req.user = user[0];
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {
  constraints: true,
  onDelete: "CASCADE",
});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order)
Order.belongsToMany(Product, { through: OrderItem });

const runApp = async () => {
  const db = await sequelize.sync();
  const user = await User.findAll({
    where: {
      id: 1,
    },
  });
  let dummyUser;
  if (!user[0]) {
    dummyUser = await User.create({ name: "Iam", email: "vlaluk352@gmail.com" });
  }
  const userCart = await Cart.findAll({
    where: {
      userId: 1,
    },
  });

  if (!userCart[0]) {
    dummyUser.createCart();
  }
  app.listen(3000);
};


runApp();
