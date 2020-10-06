const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
        if (pathname.indexOf('/') !== -1) {
            res.statusCode = 400;
            res.end('Nested path');
        }

        const stream = fs.createReadStream(filepath);

        stream.on('error', function(err) {
            if (err.code === 'ENOENT') {
                res.statusCode = 404;
                res.end();
            } else {
                res.statusCode = 500;
                res.end();
            }
        });

        stream.pipe(res).once('close', function() {
          fs.unlink(filepath, (err) => {
              if (!err) {
                  res.statusCode = 200;
                  res.end('delete success');
              }
          });
        });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
