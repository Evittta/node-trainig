const fs = require("fs");
const path = require("path");

const rootDir = require("../util/path");

const cartPath = path.join(rootDir, "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(cartPath, (err, cartData) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(cartData);
      }
      const existingProductIndex = cart.products.findIndex(
        (el) => el.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty += 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice += Number(productPrice);
      fs.writeFile(cartPath, JSON.stringify(cart), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  static deleteProduct(productId, price) {
    fs.readFile(cartPath, (err, cartData) => {
      if (err) {
        return;
      }
      let cart = JSON.parse(cartData);
      let { products, totalPrice } = cart;

      const removedProduct = products.find(({ id }) => id === productId);
      if (!removedProduct) {
        return;
      }
      const removedProductsQty = removedProduct.qty;
      totalPrice -= price * removedProductsQty;

      const updatedProducts = products.filter(({ id }) => productId !== id);

      cart = { products: updatedProducts, totalPrice };
      console.log(cart);
      fs.writeFile(cartPath, JSON.stringify(cart), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  static getCartData(cb) {
    fs.readFile(cartPath, (err, cartData) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(cartData);
      }
      cb(cart);
    });
  }
};
