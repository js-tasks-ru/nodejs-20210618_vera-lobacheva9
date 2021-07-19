const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const LIMIT_MB = 1;

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
    case 'POST':
      const pathArr = pathname.split('/');
      if (pathArr.length > 1) {
        setErrorResponse(res, 400, `bad file url "${pathname}"`)
        return;
      }
      const writeStream = fs.createWriteStream(filepath, {
        flags: 'wx',
      });

      const deleteFileOnError = () => {
        writeStream.destroy();
        fs.unlinkSync(filepath);
      };

      writeStream.on('error', (err) => {
        switch (err.code) {
          case 'EEXIST':
            setErrorResponse(res, 409, `file "${filepath}" already exists`);
            break;
          default:
            deleteFileOnError();
            setErrorResponse(res, 500, 'unknown error');
        }
      });
      writeStream.on('finish', (data) => {
        res.statusCode = 201;
        res.setHeader('Location', filepath);
        res.end();
      });

      const limitSizeStream = new LimitSizeStream({limit: LIMIT_MB * 1_000_000});
      limitSizeStream.on('error', (err) => {
        deleteFileOnError();

        if (err.code === 'LIMIT_EXCEEDED') {
          setErrorResponse(res, 413, `limit of "${LIMIT_MB}"Mb exceeded`);
          return;
        }

        setErrorResponse(res, 500, 'unknown error');
      });

      req.on('error', (err) => {
        if (err.code === 'ECONNRESET') {
          deleteFileOnError();
        }
      });
      req.pipe(limitSizeStream).pipe(writeStream);

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
