const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;

  try {
    const product = await Product.findById(prodId);

    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCart = async (req, res, next) => {
  const user = await req.user.populate("cart.items.productId");

  res.render("shop/cart", {
    products: user.cart.items,
    path: "/cart",
    pageTitle: "Your Cart",
  });
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;

  const product = await Product.findById(prodId);
  await req.user.addToCart(product);

  res.redirect("/cart");
};

exports.postCardDeleteProduct = async (req, res, next) => {
  const { productId } = req.body;
  await req.user.removeFromCart(productId);

  res.redirect("/cart");
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userid": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.postOrders = async (req, res, next) => {
  const user = await req.user.populate("cart.items.productId");

  const order = new Order({
    user: {
      email: req.user.email,
      userId: req.user,
    },
    products: user.cart.items.map((i) => ({
      quantity: i.quantity,
      productData: { ...i.productId._doc },
    })),
  });
  await req.user.clearCart();
  await order.save();
  res.redirect("/orders");
};
