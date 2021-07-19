const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.lastFragment = '';
    this.encoding = options.encoding;
  }

  _transform(chunk, encoding, callback) {
    const str = this.lastFragment + chunk.toString(this.encoding);
    const lines = str.split(os.EOL);
    this.lastFragment = lines.pop();
    lines.forEach((item) => {
      this.push(item);
    });
    callback();
  }

  _flush(callback) {
    if (this.lastFragment) {
      this.push(this.lastFragment);
    }
    callback()
  }
}

module.exports = LineSplitStream;
