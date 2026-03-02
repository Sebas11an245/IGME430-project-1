const http = require('http');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Reassemble POST body (from class example)
const parseBody = (request, response, handler) => {
    const body = [];

    request.on('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
    });

    request.on('data', (chunk) => {
        body.push(chunk);
    });

    request.on('end', () => {
        const bodyString = Buffer.concat(body).toString();
        const type = request.headers['content-type'];

        if (type === 'application/x-www-form-urlencoded') {
            request.body = query.parse(bodyString);
        } else if (type === 'application/json') {
            request.body = JSON.parse(bodyString);
        } else {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify({ error: 'Invalid data format' }));
            response.end();
            return;
        }

        handler(request, response);
    });
};

// Handle POST requests
const handlePost = (request, response, parsedUrl) => {
    if (parsedUrl.pathname === '/api/addPokemon') {
        parseBody(request, response, jsonHandler.addPokemon);
    } else if (parsedUrl.pathname === '/api/updatePokemon') {
        parseBody(request, response, jsonHandler.updatePokemon);
    } else {
        response.writeHead(404, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify({ message: 'Endpoint not found' }));
        response.end();
    }
};

// Handle GET requests
const handleGet = (request, response, parsedUrl) => {
    const queryParams = Object.fromEntries(parsedUrl.searchParams);

    if (parsedUrl.pathname === '/') {
        htmlHandler.getIndex(request, response);
    } else if (parsedUrl.pathname === '/style.css') {
        htmlHandler.getCSS(request, response);
    } else if (parsedUrl.pathname === '/client.js') {
        htmlHandler.getClientJS(request, response);
    } else if (parsedUrl.pathname === '/api/pokemon') {
        jsonHandler.getPokemon(request, response, queryParams);
    } else if (parsedUrl.pathname === '/api/pokemonById') {
        jsonHandler.getPokemonById(request, response, queryParams);
    } else if (parsedUrl.pathname === '/api/types') {
        jsonHandler.getTypes(request, response);
    } else if (parsedUrl.pathname === '/api/random') {
        jsonHandler.getRandomPokemon(request, response);
    } else {
        response.writeHead(404, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify({ message: 'Resource not found' }));
        response.end();
    }
};
// Handle HEAD requests
const handleHead = (request, response, parsedUrl) => {
    const queryParams = Object.fromEntries(parsedUrl.searchParams);

    if (parsedUrl.pathname === '/api/pokemon') {
        jsonHandler.headPokemon(request, response, queryParams);
    } else if (parsedUrl.pathname === '/api/pokemonById') {
        jsonHandler.headPokemonById(request, response, queryParams);
    } else if (parsedUrl.pathname === '/api/types') {
        jsonHandler.headTypes(request, response, queryParams);
    } else if (parsedUrl.pathname === '/api/random') {
        jsonHandler.headRandomPokemon(request, response);
    } else {
        response.writeHead(404, { 'Content-Type': 'application/json' });
        response.end();
    }
};

// Main request handler
const onRequest = (request, response) => {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

    if (request.method === 'POST') {
        handlePost(request, response, parsedUrl);
    } else if (request.method === 'HEAD') {
        handleHead(request, response, parsedUrl);
    } else {
        handleGet(request, response, parsedUrl);
    }
};

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1:${port}`);
});