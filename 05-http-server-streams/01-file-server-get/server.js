const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  const readStream = fs.createReadStream(filepath);

  switch (req.method) {
    case 'GET':
        if (pathname.indexOf('/') !== -1) {
            res.statusCode = 400;
            res.end('Nested path');
        }

        readStream.on('error', function(err) {
            if (err.code === 'ENOENT') {
                res.statusCode = 404;
                res.end();
            } else {
                res.statusCode = 500;
                res.end();
            }
        });

        readStream
            .pipe(res);

        break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
