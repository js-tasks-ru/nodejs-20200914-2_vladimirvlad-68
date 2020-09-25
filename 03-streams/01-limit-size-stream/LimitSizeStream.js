const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.totalSize = 0;
  }

  _transform(chunk, encoding, callback) {
    try {
      const data = chunk.toString('utf8');
      this.totalSize += data.length;
      if (this.totalSize > this.limit) {
        throw new LimitExceededError();
      } else {
        callback(null, data);
      }
    } catch(e) {
        callback(e);
    }
  }
}

module.exports = LimitSizeStream;
