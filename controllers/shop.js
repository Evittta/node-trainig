const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getProduct = (req, res, next) => {
  const { id } = req.params;
  Product.findById(id, (product) => {
    res.render(`shop/product-detail`, {
      product,
      pageTitle: "Product Detail",
      path: "/products",
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCartData((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = cart.products.map((cartEl) => {
        const fullDataProduct = products.find(({ id }) => id === cartEl.id);
        fullDataProduct.qty = cartEl.qty;
        return fullDataProduct;
      });
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        total: cart.totalPrice,
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect("/cart");
};

exports.postDeleteCartProduct = (req, res, next) => {
  const { id, price } = req.body;
  console.log(id, price);
  Cart.deleteProduct(id, price);
  res.redirect("/cart");
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
