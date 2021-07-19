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

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const search_query = ctx.query.query;
  if (search_query) {
    const products = await Products.find({
      $text: { 
        $search: decodeURIComponent(search_query),
      }
    }, {
      score: {
        $meta: 'textScore',
      }
    }).sort({
      score: {
        $meta: 'textScore'
      }
    });
    ctx.body = {
      products: products.map(productDTO),
    };
  } else {
    await next();
  }
};
