
const row = document.querySelector('.row');

async function createPokemonCards() {
  for (let i = 1; i <= 1008; i++) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const data = await response.json();
    const card = document.createElement('div');
    card.classList.add('card', data.types[0].type.name);

    const img = document.createElement('img');
    img.src = data.sprites.front_default;
    img.alt = data.name;
    card.appendChild(img);

    const number = document.createElement('p');
    number.textContent = `#${data.id.toString().padStart(3, '0')}`;
    card.appendChild(number);

    const name = document.createElement('h2');
    name.textContent = data.name;
    card.appendChild(name);

    const type = document.createElement('p');
    type.textContent = `Type: ${data.types.map(types => types.type.name).join(', ')}`;

    /* if unfamiliar with map() and join(), here is an alternative:

    example for dataobject:
    const data = {
    types: [
       { type: { name: 'fire' } },
       { type: { name: 'flying' } }
       ]
    };

    let typeString = 'Type: ';
    for (let i = 0; i < data.types.length; i++) {
       typeString += data.types[i].type.name;
       if (i < data.types.length - 1) {
          typeString += ', ';
        }
    }
    type.textContent = typeString;
    */

    card.appendChild(type);


    const moves = document.createElement('p');
    moves.textContent = `Moves: ${data.moves.map(move => move.move.name).slice(0, 4).join(', ')}`;
    card.appendChild(moves);

    // Append the card element to the row element
    row.appendChild(card);
  }
}

// Call the createPokemonCards() function to create the Pokemon cards
createPokemonCards();
