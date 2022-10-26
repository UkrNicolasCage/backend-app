const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findAll({
    where: {
      id: prodId,
    },
  })
    .then((product) => {
      res.render("shop/product-detail", {
        product: product[0],
        pageTitle: product[0].title,
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user.getCart().then(async (cart) => {
    const products = await cart.getProducts();
    res.render("shop/cart", {
      products,
      path: "/cart",
      pageTitle: "Your Cart",
    });
  });
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  let newQuantity = 1;

  const cart = await req.user.getCart();

  const products = await cart.getProducts({
    where: {
      id: prodId,
    },
  });
  console.log(products);

  let product;
  if (products.length > 0) {
    product = products[0];
  }

  if (product) {
    const oldQuantity = product.cartItem.quantity;
    newQuantity = oldQuantity + 1;

    await cart.addProduct(product, {
      through: { quantity: newQuantity },
    });
  } else {
    const newProduct = await Product.findAll({
      where: {
        id: prodId,
      },
    });

    await cart.addProduct(newProduct, {
      through: { quantity: newQuantity },
    });
  }

  res.redirect("/");
};

exports.postCardDeleteProduct = async (req, res, next) => {
  const { productId } = req.body;
  const cart = await req.user.getCart();
  const product = await cart.getProducts({ where: { id: productId } });
  await product[0].cartItem.destroy();

  res.redirect("/cart");
};

exports.getOrders = async (req, res, next) => {
  const orders =  await req.user.getOrders({include: ['products']});


  res.render("shop/orders", {
    orders: orders,
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.postOrders = async (req, res, next) => {
  const cart = await req.user.getCart();
  const products = await cart.getProducts();
  const order = await req.user.createOrder();

  await order.addProducts(
    products.map((product) => {
      product.orderItem = { quantity: product.cartItem.quantity };
      return product;
    })
  );
  cart.setProducts(null);
  res.redirect("/orders");
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
