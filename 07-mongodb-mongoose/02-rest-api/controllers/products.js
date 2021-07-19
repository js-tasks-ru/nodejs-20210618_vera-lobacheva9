const mongoose = require('mongoose');
const Products = require('../models/Product');

const productDTO = (doc) => {
  return {
    id: doc._id,
    title: doc.title,
    images: doc.images,
    category: doc.category,
    subcategory: doc.subcategory,
    price: doc.price,
    description: doc.description,
  }
};

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcategory = ctx.query.subcategory;
  if (subcategory) {
    if (!mongoose.isValidObjectId(subcategory)) {
      throw {
        status: 400,
        message: 'subcategory is not a valid ObjectID',
      };
    }
    const products = await Products.find({
      subcategory: mongoose.Types.ObjectId(subcategory),
    });

    ctx.body = {
      products: products.map(productDTO),
    };
  } else {
    await next();
  }
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Products.find();
  ctx.body = {
    products: products.map(productDTO),
  };
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;
  if (!mongoose.isValidObjectId(id)) {
    throw {
      status: 400,
      message: 'productId is not a valid ObjectID',
    };
  }
  const product = await Products.findOne({
    _id: mongoose.Types.ObjectId(id),
  });
  if (!product) {
    throw {
      status: 404,
      message: 'product is not found',
    };
  }
  ctx.body = {
    product: productDTO(product),
  };
};
