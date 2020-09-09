const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Edit Product",
    path: "/admin/add-product",
    edit: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  let {
    title,
    imageUrl = "https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png",
    description = "A very interesting book about so many even more interesting things!",
    price = 10.2,
  } = req.body;
  description =
    description ||
    "A very interesting book about so many even more interesting things!";
  imageUrl =
    imageUrl ||
    "https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png";
  price = price || 10.2;
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  const { edit } = req.query;
  if (!edit) {
    return res.redirect("/");
  }
  const { productId } = req.params;
  Product.findById(productId, (product) => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      edit,
      product,
    });
  });
};

exports.postEditedProduct = (req, res, next) => {
  const { id, title, imageUrl, description, price } = req.body;
  const product = new Product(id, title, imageUrl, description, price);
  product.save();
  res.redirect("/admin/products");
};

exports.deleteProduct = (req, res, next) => {
  const { id, price } = req.body;
  Product.removeProduct(id, price);
  res.redirect("/admin/products");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};
