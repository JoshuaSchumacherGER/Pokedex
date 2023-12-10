document.addEventListener('DOMContentLoaded', async () => {
  // Global Variables
  const pokemonPerPage = 10;
  let nextPagePaginator = null;

  await listPokemons({pokemonPerPage});

  // event listeners
  document.addEventListener('scroll', async () => {
    let documentHeight = document.documentElement.scrollHeight;
    let currentScroll = window.scrollY + window.innerHeight;
    if (currentScroll >= documentHeight) {
      await listPokemons({nextPage: nextPagePaginator});
    }
  });

  // Functions
  async function listPokemons({pokemonPerPage, nextPage}) {
    const paginator = await getPokemonsPaginatedAPI({pokemonPerPage, nextPage});
    console.log(paginator);
    nextPagePaginator = paginator.next;
    for (const pokemon of paginator.results) {
      const data = await getPokemonAPI(pokemon.name);
      createPokemonCardHtml(data);
    }
  }

  async function getPokemonsPaginatedAPI({pokemonPerPage, nextPage}) {
    const response = await fetch(nextPage ?? `https://pokeapi.co/api/v2/pokemon/?offset=0&limit=${pokemonPerPage}`);
    return await response.json();
  }

  async function getPokemonAPI(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return await response.json();
  }

  function createPokemonCardHtml(pokemon) {
    const row = document.querySelector('.row');
    console.log(pokemon);
    const card = document.createElement('div');
    card.classList.add('card', pokemon.types[0].type.name);

    const img = document.createElement('img');
    img.src = pokemon.sprites.front_default;
    img.alt = pokemon.name;
    card.appendChild(img);

    const number = document.createElement('p');
    number.textContent = `#${pokemon.id.toString().padStart(3, '0')}`;
    card.appendChild(number);

    const name = document.createElement('h2');
    name.textContent = pokemon.name;
    card.appendChild(name);

    const type = document.createElement('p');
    type.textContent = `Type: ${pokemon.types.map(types => types.type.name).join(', ')}`;

    /* if unfamiliar with map() and join(), here is an alternative:

    example for dataobject:
    const pokemon = {
    types: [
       { type: { name: 'fire' } },
       { type: { name: 'flying' } }
       ]
    };

    let typeString = 'Type: ';
    for (let i = 0; i < pokemon.types.length; i++) {
       typeString += pokemon.types[i].type.name;
       if (i < pokemon.types.length - 1) {
          typeString += ', ';
        }
    }
    type.textContent = typeString;
    */

    card.appendChild(type);


    const moves = document.createElement('p');
    moves.textContent = `Moves: ${pokemon.moves.map(move => move.move.name).slice(0, 4).join(', ')}`;
    card.appendChild(moves);

    // Append the card element to the row element
    row.appendChild(card);
  }

});
