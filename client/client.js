// Handles FETCH response
const handleResponse = async (response) => {
    const content = document.querySelector('#content');

    switch (response.status) {
        case 200:
            content.innerHTML = '<b>Success</b>';
            break;
        case 201:
            content.innerHTML = '<b>Created</b>';
            break;
        case 204:
            content.innerHTML = '<b>No Content</b>';
            return;
        case 400:
            content.innerHTML = '<b>Bad Request</b>';
            break;
        case 404:
            content.innerHTML = '<b>Not Found</b>';
            break;
        default:
            content.innerHTML = 'Error code not implemented by client.';
            break;
    }

    // HEAD has no body
    if (response.method === 'HEAD') return;

    const obj = await response.json();

    if (Array.isArray(obj)) {
        displayPokemon(obj);
    } else if (obj.message) {
        content.innerHTML += `<p>${obj.message}</p>`;
    } else {
        displayPokemon([obj]);
    }
};

// Uses fetch to send GET request
const sendGet = async () => {
    const name = document.querySelector('#nameField').value;
    const type = document.querySelector('#typeField').value;

    let url = '/api/pokemon?';

    if (name) url += `name=${name}&`;
    if (type) url += `type=${type}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    });

    handleResponse(response);
};
// GET by ID
const sendGetById = async () => {
    const id = document.querySelector('#idField').value;

    const url = `/api/pokemonById?id=${id}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    });

    handleResponse(response);
};

// POST request (add Pokemon)
const sendPost = async (form) => {
    const url = form.getAttribute('action');
    const method = form.getAttribute('method');

    const id = form.querySelector('#addId').value;
    const name = form.querySelector('#addName').value;
    const type = form.querySelector('#addType').value;

    const dataType = form.querySelector('#dataType').value;

    let formData = `id=${id}&name=${name}&type=${type}`;

    if (dataType === 'application/json') {
        formData = JSON.stringify({ id, name, type: type.split(',') });
    }

    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': dataType,
            'Accept': 'application/json',
        },
        body: formData,
    });

    handleResponse(response);
};

// POST update Pokemon
const sendUpdate = async (form) => {
    const url = form.action;
    const dataType = document.querySelector('#updateDataType').value;

    const id = document.querySelector('#updateId').value;
    const name = document.querySelector('#updateName').value;
    const type = document.querySelector('#updateType').value;

    let formData = `id=${id}&name=${name}&type=${type}`;

    if (dataType === 'application/json') {
        formData = JSON.stringify({ id, name, type });
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': dataType,
            Accept: 'application/json',
        },
        body: formData,
    });

    handleResponse(response);
};

// HEAD request
const sendHead = async () => {
    const response = await fetch('/api/pokemon', {
        method: 'HEAD',
        headers: { Accept: 'application/json' },
    });

    const content = document.querySelector('#content');
    content.innerHTML = `<b>HEAD request success. Status: ${response.status}</b>`;
};
// Display pokemon as cards
const displayPokemon = (pokemonList) => {
    const content = document.querySelector('#content');
    content.innerHTML = '';

    if (!pokemonList || pokemonList.length === 0) {
        content.innerHTML = '<p>No Pokémon found.</p>';
        return;
    }

    pokemonList.forEach((pokemon) => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
          <h3>${pokemon.name}</h3>
          <p><strong>ID:</strong> ${pokemon.id}</p>
          <p><strong>Type:</strong> ${pokemon.type.join(', ')}</p>
        `;

        content.appendChild(card);
    });
};

const getRandomPokemon = async () => {
  const response = await fetch('/api/random', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });
 
  handleResponse(response);
};

// Init function
const init = () => {
    const randomBtn = document.querySelector("#randomBtn");
    randomBtn.addEventListener('click', getRandomPokemon);

    const searchForm = document.querySelector('#searchForm');
    const idForm = document.querySelector('#idForm');
    const addForm = document.querySelector('#addForm');
    const updateForm = document.querySelector('#updateForm');
    const headForm = document.querySelector('#headForm');

    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            sendGet();
        });
    }

    if (idForm) {
        idForm.addEventListener('submit', (e) => {
            e.preventDefault();
            sendGetById();
        });
    }

    if (addForm) {
        addForm.addEventListener('submit', (e) => {
            e.preventDefault();
            sendPost(e.target);
        });
    }

    if (updateForm) {
        updateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            sendUpdate(e.target);
        });
    }

    if (headForm) {
        headForm.addEventListener('submit', (e) => {
            e.preventDefault();
            sendHead();
        });
    }
};

window.onload = init;