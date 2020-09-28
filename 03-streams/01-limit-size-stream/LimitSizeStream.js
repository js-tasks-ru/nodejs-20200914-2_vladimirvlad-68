const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.totalSize = 0;
  }

  _transform(chunk, encoding, callback) {
      const data = chunk.toString('utf8');
      this.totalSize += data.length;
      if (this.totalSize > this.limit) {
        callback(new LimitExceededError());
      } else {
        callback(null, data);
      }
  }
}

module.exports = LimitSizeStream;
