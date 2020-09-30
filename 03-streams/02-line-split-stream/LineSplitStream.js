const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.data = '';
  }

  _transform(chunk, encoding, callback) {
      this.data += chunk.toString();
      if (this.data.indexOf(os.EOL) !== -1) {
          let lines = this.data.split(os.EOL);
          let lastElem = lines.splice(lines.length - 1, 1)[0];
          lines.forEach(line => this.push(line));
          this.data = lastElem;
      }
      callback()
  }

  _flush(callback) {
      this.push(this.data);
      callback();
  }
}

module.exports = LineSplitStream;
