const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.sum = 0;
    this.limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    this.sum += Buffer.byteLength(chunk);
    if (this.sum > this.limit) {
      return callback(new LimitExceededError());
    }
    return callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
