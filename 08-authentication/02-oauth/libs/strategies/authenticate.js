const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    return done(null, false, 'Не указан email');
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, displayName });
    }

    return done(null, user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return done(err, false, 'Некорректный email.');
    }
    
    return done(err);
  }
};
