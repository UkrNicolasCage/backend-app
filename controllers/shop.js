const Product = require("../models/product");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
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
    const products = await Product.fetchAll();
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
  const products = await req.user.getCart();

  res.render("shop/cart", {
    products,
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
  await req.user.deleteItemFromCart(productId);

  res.redirect("/cart");
};

exports.getOrders = async (req, res, next) => {
  const orders = await req.user.getOrders();

  res.render("shop/orders", {
    orders: orders,
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.postOrders = async (req, res, next) => {
  await req.user.addOrder()
  res.redirect("/orders");
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
