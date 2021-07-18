const Category = require('../models/Category');

const subCategoryDTO = (doc) => {
  return {
    id: doc._id,
    title: doc.title,
  }
}
const categoryDTO = (doc) => {
  return {
    id: doc._id,
    title: doc.title,
    subcategories: doc.subcategories.map(subCategoryDTO),
  }
}

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find();
  ctx.body = {
    categories: categories.map(categoryDTO),
  };
};
