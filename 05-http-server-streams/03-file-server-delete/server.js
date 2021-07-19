const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const setErrorResponse = (res, code, message) => {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    error: message,
  }));
};

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      const pathArr = pathname.split('/');
      if (pathArr.length > 1) {
        setErrorResponse(res, 400, `bad file url "${pathname}"`)
        return;
      }

      fs.unlink(filepath, (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            setErrorResponse(res, 404, `file "${filepath}" is not found`);
            return;
          };
          setErrorResponse(res, 500, 'unknown error');
          console.log(err.code);
        }

        res.statusCode = 200;
        res.end();
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
