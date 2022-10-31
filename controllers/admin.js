const mongodb = require("mongodb");
const product = require("../models/product");
const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = async (req, res, next) => {
  const { title, price, description, imageUrl } = req.body;
  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user,
  });

  await product.save();

  res.redirect("/");
};

exports.getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;

  try {
    const product = await Product.findById(prodId);

    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditProduct = async (req, res, next) => {
  const { productId, title, price, description, imageUrl } = { ...req.body };

  const updatedProduct = await Product.findById(productId);
  if (updatedProduct.userId.toString() !== req.user._id.toString()) {
    res.redirect("/");
  } else {
    updatedProduct.title = title;
    updatedProduct.price = price;
    updatedProduct.description = description;
    updatedProduct.imageUrl = imageUrl;

    await updatedProduct.save();

    res.redirect("/admin/products");
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ userId: req.user._id });
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const { productId } = req.body;
  try {
    await Product.deleteOne({ _id: productId, userId: req.user._id });
  } catch (err) {
    console.log(err);
  } finally {
    res.redirect("/admin/products");
  }
};
