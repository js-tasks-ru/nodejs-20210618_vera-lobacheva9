const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

const productDTO = (doc) => {
  return {
    id: doc._id,
    title: doc.title,
    images: doc.images,
    category: doc.category,
    subcategory: doc.subcategory,
    price: doc.price,
    description: doc.description,
  };
};

const orderDTO = (doc) => {
  return {
    id: doc._id,
    user: doc.user,
    product: productDTO(doc.product),
    phone: doc.phone,
    address: doc.address,
  };
};

module.exports.checkout = async function checkout(ctx, next) {
  const product = ctx.request.body.product;
  const phone = ctx.request.body.phone;
  const address = ctx.request.body.address;

  const newOrder = await new Order({
    user: ctx.user._id,
    product,
    phone,
    address,
  }).save();

  await sendMail({
    to: ctx.user.email,
    template: 'order-confirmation',
    locals: {
      id: newOrder._id,
      product: newOrder.product,
    },
  });

  ctx.status = 200;
  ctx.body = {
    order: newOrder._id,
  };
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({
    user: ctx.user._id,
  }).populate('product');
  ctx.status = 200;
  ctx.body = {
    orders: orders.map(orderDTO),
  };
};
