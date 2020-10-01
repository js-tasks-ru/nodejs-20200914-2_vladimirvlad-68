const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  const writableStream = fs.createWriteStream(`new.${filepath}`, {flags: 'wx'});

  const limitStream = new LimitSizeStream({limit: 1000000});

  let dataFile = [];

  switch (req.method) {
    case 'POST':
        console.log(1, pathname);
        if (pathname.indexOf('/') !== -1) {
            console.log(2);
            res.statusCode = 400;
            res.end('Nested path');
            return;
        }

        req.on('end', function() {
            console.log(4);
            limitStream.on('error', function(){
                console.log(5);
                res.statusCode = 413;
                res.end('file size limit exceeded');
            });

            writableStream.on('error', function(err) {
                console.log(6);
                if (err.code === 'EEXIST') {
                    console.log(7);
                    res.statusCode = 409;
                    res.end('file has already existed');
                    return;
                }
                fs.unlink(`new.${filepath}`);
                res.statusCode = 500;
                res.end();
            });

            writableStream.on('close', () => {
                console.log(7);
                res.statusCode = 201;
                res.end('alright');
            });

            limitStream.pipe(writableStream);
            limitStream.end();
        });

        break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
