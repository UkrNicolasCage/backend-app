const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  await req.user.createProduct({
    title,
    price,
    imageUrl,
    description,
  });

  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findAll({
    where: {
      id: prodId,
    },
  })
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product[0],
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, description, imageUrl } = { ...req.body };
  Product.findAll({
    where: {
      id: productId,
    },
  })
    .then((products) => {
      const product = products[0];

      [product.title, product.price, product.description, product.imageUrl] = [
        title,
        price,
        description,
        imageUrl,
      ];
      return product.save();
    })
    .catch((err) => {
      console.log(err);
    });

  res.redirect("/admin/products");
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.destroy({
    where: {
      id: productId,
    },
  }).then(() => {
    res.redirect("/admin/products");
  });
};
