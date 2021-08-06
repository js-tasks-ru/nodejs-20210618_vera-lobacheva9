const Message = require('../models/Message');

const messageDTO = (doc) => {
  return {
    date: doc.date,
    text: doc.text,
    id: doc._id,
    user: doc.user,
  };
};

module.exports.messageList = async function messages(ctx, next) {
  const messages = await Message.find({
    chat: ctx.user,
  }).limit(20);
  ctx.body = {
    messages: messages.map(messageDTO)
  };
};
