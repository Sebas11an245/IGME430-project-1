const fs = require('fs');

// serve index.html
const getIndex = (request, response) => {
  fs.readFile(`${__dirname}/../client/index.html`, (err, data) => {
    if (err) {
      response.writeHead(500, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify({ message: 'File not found' }));
      response.end();
      return;
    }

    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(data);
    response.end();
  });
};

// serve style.css
const getCSS = (request, response) => {
  fs.readFile(`${__dirname}/../client/style.css`, (err, data) => {
    if (err) {
      response.writeHead(500, { 'Content-Type': 'application/json' });
      response.write(JSON.stringify({ message: 'File not found' }));
      response.end();
      return;
    }

    response.writeHead(200, { 'Content-Type': 'text/css' });
    response.write(data);
    response.end();
  });
};

module.exports = {
  getIndex,
  getCSS,
};