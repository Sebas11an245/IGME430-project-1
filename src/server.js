const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || 3000;

const onRequest = (request, response) => {
  const protocol = request.socket.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);
  const pathname = parsedUrl.pathname;
  const query = Object.fromEntries(parsedUrl.searchParams);

  if (request.method === 'GET') {
    switch (pathname) {
      case '/':
        htmlHandler.getIndex(request, response);
        break;

      case '/style.css':
        htmlHandler.getCSS(request, response);
        break;

      case '/api/pokemon':
        jsonHandler.getPokemon(request, response, query);
        break;

      case '/api/pokemonById':
        jsonHandler.getPokemonById(request, response, query);
        break;

      case '/api/pokemonByType':
        jsonHandler.getPokemonByType(request, response, query);
        break;

      default:
        response.writeHead(404, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify({ message: 'Not Found' }));
        response.end();
        break;
    }
  }
};

http.createServer(onRequest).listen(port);