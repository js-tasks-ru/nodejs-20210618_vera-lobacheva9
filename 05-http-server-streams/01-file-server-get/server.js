const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

const setErrorResponse = (res, code, message) => {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    error: message,
  }));
};

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      const pathArr = pathname.split('/');
      if (pathArr.length > 1) {
        setErrorResponse(res, 400, `bad file url "${pathname}"`)
        return;
      }

      fs.createReadStream(filepath).on('error', (err) => {
        switch (err.code) {
          case 'ENOENT':
            setErrorResponse(res, 404, `file "${filepath}" is not found`);
            break;
          default:
            setErrorResponse(res, 500, 'unknown error');
        }
      }).pipe(res);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
