const pokedex = require('../data/pokedex.json');

// Helper to send JSON
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};
// Helper for HEAD responses
const respondHEAD = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// GET /api/pokemon
const getPokemon = (request, response, query) => {
  let results = pokedex;

  if (query.name) {
    results = results.filter((p) =>
      p.name.toLowerCase().includes(query.name.toLowerCase())
    );
  }

  if (query.type) {
    results = results.filter((p) =>
      p.type.map((t) => t.toLowerCase()).includes(query.type.toLowerCase())
    );
  }

  if (results.length === 0) {
    respondJSON(request, response, 204, {});
    return;
  }

  respondJSON(request, response, 200, results);
};
// HEAD /api/pokemon
const headPokemon = (request, response, query) => {
  let results = pokedex;

  if (query.name) {
    results = results.filter((p) =>
      p.name.toLowerCase().includes(query.name.toLowerCase())
    );
  }

  if (query.type) {
    results = results.filter((p) =>
      p.type.map((t) => t.toLowerCase()).includes(query.type.toLowerCase())
    );
  }

  if (results.length === 0) {
    respondHEAD(request, response, 204);
    return;
  }

  respondHEAD(request, response, 200);
};

// GET /api/pokemonById?id=#
const getPokemonById = (request, response, query) => {
  if (!query.id) {
    respondJSON(request, response, 400, { message: 'ID is required' });
    return;
  }

  const id = Number(query.id);

  if (Number.isNaN(id)) {
    respondJSON(request, response, 400, { message: 'ID must be a number' });
    return;
  }

  const result = pokedex.find((p) => p.id === id);

  if (!result) {
    respondJSON(request, response, 404, { message: 'Pokemon not found' });
    return;
  }

  respondJSON(request, response, 200, result);
};
// HEAD /api/pokemonById
const headPokemonById = (request, response, query) => {
  if (!query.id) {
    respondHEAD(request, response, 400);
    return;
  }

  const id = Number(query.id);
  if (Number.isNaN(id)) {
    respondHEAD(request, response, 400);
    return;
  }

  const result = pokedex.find((p) => p.id === id);

  if (!result) {
    respondHEAD(request, response, 404);
    return;
  }

  respondHEAD(request, response, 200);
};

// GET /api/types
const getTypes = (request, response) => {
  const types = new Set();

  pokedex.forEach((p) => {
    p.type.forEach((t) => types.add(t));
  });

  respondJSON(request, response, 200, Array.from(types));
};

// POST /api/addPokemon
const addPokemon = (request, response) => {
  const { id, name, type } = request.body;

  // Validate input
  if (!id || !name || !type) {
    respondJSON(request, response, 400, {
      message: 'ID, name, and type are required',
    });
    return;
  }

  const numId = Number(id);

  if (Number.isNaN(numId)) {
    respondJSON(request, response, 400, {
      message: 'ID must be a number',
    });
    return;
  }

  // Check for duplicate ID
  const exists = pokedex.find((p) => p.id === numId);

  if (exists) {
    respondJSON(request, response, 400, {
      message: 'Pokemon with that ID already exists',
    });
    return;
  }

  // Build new Pokemon object
  const newPokemon = {
    id: numId,
    name,
    type: Array.isArray(type) ? type : type.split(','),
  };

  // Add to in-memory dataset
  pokedex.push(newPokemon);

  respondJSON(request, response, 201, {
    message: 'Pokemon added successfully',
    pokemon: newPokemon,
  });
};

// POST /api/updatePokemon
const updatePokemon = (request, response) => {
  const { id, newId, name, type } = request.body;

  if (!id) {
    respondJSON(request, response, 400, {
      message: 'Existing Pokemon ID is required',
    });
    return;
  }

  const numId = Number(id);
  if (Number.isNaN(numId)) {
    respondJSON(request, response, 400, {
      message: 'ID must be a number',
    });
    return;
  }

  const pokemon = pokedex.find((p) => p.id === numId);

  if (!pokemon) {
    respondJSON(request, response, 404, {
      message: 'Pokemon not found',
    });
    return;
  }

  // Update fields if provided
  if (newId) {
    const newNumId = Number(newId);
    if (Number.isNaN(newNumId)) {
      respondJSON(request, response, 400, { message: 'newId must be a number' });
      return;
    }
    pokemon.id = newNumId;
  }

  if (name) pokemon.name = name;

  if (type) {
    pokemon.type = Array.isArray(type) ? type : type.split(',');
  }

  respondJSON(request, response, 204, {
    message: 'Pokemon updated successfully',
  });
};

module.exports = {
  getPokemon,
  getPokemonById,
  getTypes,
  addPokemon,
  updatePokemon,
  headPokemon,
  headPokemonById,
};