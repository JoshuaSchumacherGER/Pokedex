
const row = document.querySelector('.row');

// Old Version with .then chaining. Use this if you want to support older browsers.

for (let i = 1; i <= 150; i++) {
 
  fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
    .then(response => response.json())
    .then(data => {
      const card = document.createElement('div');
      card.classList.add('card', data.types[0].type.name);
      const img = document.createElement('img');
      img.src = data.sprites.front_default;
      img.alt = data.name;
      const number = document.createElement('p');
      number.textContent = `#${data.id.toString().padStart(3, '0')}`;
      const name = document.createElement('h2');
      name.textContent = data.name;
      const type = document.createElement('p');
      type.textContent = `Type: ${data.types.map(type => type.type.name).join(', ')}`;
      const moves = document.createElement('p');
      moves.textContent = `Moves: ${data.moves.map(move => move.move.name).slice(0, 4).join(', ')}`;
      card.appendChild(img);
      card.appendChild(number);
      card.appendChild(name);
      card.appendChild(type);
      card.appendChild(moves);
      row.appendChild(card);
    });
}