const asyncHandler = require("express-async-handler");
const Product = require("../model/productModel");
const ErrorHandler = require("../utils/ErrorHandel");
const { cloudinary } = require('../middelware/uploadImage')


exports.createProduct = asyncHandler(async (req, res, next) => {
  try {
    const { name, description, catId, price, stock } = req.body;

    if (!name || !price) {
      return next(new ErrorHandler("Name and price are required", 400));
    }

    let images = [];
    let imagePublicIds = [];

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        images.push(file.path);
        imagePublicIds.push(file.filename);
      });
    }

    const product = await Product.create({
      name,
      description,
      catId,
      price,
      stock,
      images,
      imagePublicIds,
    });

    res.status(201).json({
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

exports.getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({},{imagePublicIds:false}).populate("catId", "name");
  res.status(200).json({ count: products.length, data: products });
});

exports.getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("catId", "name");
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json(product);
});

// ✅ Update Product
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const { name, description, catId, price, stock } = req.body;

  if (req.files && req.files.length > 0) {
    
    if (product.imagePublicIds.length > 0) {
      await Promise.all(
        product.imagePublicIds.map((publicId) =>
          cloudinary.uploader.destroy(publicId)
        )
      );
    }

    let newImages = [];
    let newPublicIds = [];
    req.files.forEach((file) => {
      newImages.push(file.path);
      newPublicIds.push(file.filename);
    });

    product.images = newImages;
    product.imagePublicIds = newPublicIds;
  }

  product.name = name || product.name;
  product.description = description || product.description;
  product.catId = catId || product.catId;
  product.price = price || product.price;
  product.stock = stock ?? product.stock;

  await product.save();

  res.status(200).json({ message: "Product updated successfully", data: product });
});


exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

 
  if (product.imagePublicIds.length > 0) {
    await Promise.all(
      product.imagePublicIds.map((publicId) =>
        cloudinary.uploader.destroy(publicId)
      )
    );
  }

  await product.deleteOne();

  res.status(200).json({ message: "Product deleted successfully" });
});
