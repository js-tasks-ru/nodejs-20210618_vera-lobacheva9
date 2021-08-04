const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const displayName = ctx.request.body.displayName;
  const email = ctx.request.body.email;
  const password = ctx.request.body.password;

  const verificationToken = uuid();
  const user = new User({email, displayName, verificationToken});
  await user.setPassword(password);
  await user.save();

  await sendMail({
    to: email,
    template: 'confirmation',
    locals: {
      token: verificationToken,
    },
  });

  ctx.status = 200;
  ctx.body = { 
    status: 'ok',
  };
};

module.exports.confirm = async (ctx, next) => {
  const verificationToken = ctx.request.body.verificationToken;
  if (!verificationToken) {
    ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
    return;
  }

  const user = await User.findOneAndUpdate({
    verificationToken
  }, {
    $unset: {
      verificationToken: 1,
    }
  });

  if (!user) {
    ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
    return;
  }

  const token = await ctx.login(user);

  ctx.status = 200;
  ctx.body = { 
    token,
  };
};
