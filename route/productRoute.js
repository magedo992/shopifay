const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controller/productController");
const { uploadProduct } = require("../middelware/uploadImage");



router.route('/product')
  .get(getProducts)
  .post(uploadProduct.array("images", 5), createProduct);

router.route('/product/:id')
  .get(getProductById)
  .put(uploadProduct.array("images", 5), updateProduct)
  .delete(deleteProduct);

module.exports = router;
