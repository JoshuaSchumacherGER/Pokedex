// DOM elements
const row = document.querySelector(".row");
const languageSelect = document.getElementById("language");

// Translations for different languages
const translations = {
  en: {
    abilities: "Abilities",
    held_items: "Held items",
    type: "Type",
    moves: "Moves",
    weight: "Weight",
    cry: "Cry",
    close: "Close",
  },
  de: {
    abilities: "Fähigkeiten",
    held_items: "Getragene Gegenstände",
    type: "Typ",
    moves: "Bewegungen",
    weight: "Gewicht",
    cry: "Schrei",
    close: "Schließen",
  },
  ja: {
    abilities: "特性",
    held_items: "持ち物",
    type: "タイプ",
    moves: "技",
    weight: "重さ",
    cry: "鳴き声",
    close: "閉じる",
  },
};

const typeColors = new Map([
  ["bug", "#a8b820"],
  ["fire", "#f08030"],
  ["water", "#6890f0"],
  ["grass", "#78c850"],
  ["poison", "#a040a0"],
  ["ground", "#e0c068"],
  ["rock", "#b8a038"],
  ["fighting", "#c03028"],
  ["electric", "#f8d030"],
  ["psychic", "#f85888"],
  ["ice", "#98d8d8"],
  ["dragon", "#7038f8"],
  ["dark", "#705848"],
  ["fairy", "#ee99ac"],
  ["steel", "#b8b8d0"],
  ["flying", "#a890f0"],
  ["ghost", "#705898"],
  ["normal", "#a8a878"],
]);

// Default language
let currentLanguage = "en";

// Active request controller to manage fetch requests
let activeRequestController = null;

// Fetch translated data from API
async function fetchTranslatedData(url, language, fallbackLanguage = "en") {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const translatedData = data.names.find(
      (name) => name.language.name === language
    );
    if (translatedData) {
      return translatedData.name;
    } else {
      const fallbackData = data.names.find(
        (name) => name.language.name === fallbackLanguage
      );
      return fallbackData ? fallbackData.name : null;
    }
  } catch (error) {
    console.error(`Error fetching translation data from ${url}:`, error);
    return null;
  }
}

// Fetch translated ability data from API
async function fetchTranslatedAbility(url, language, fallbackLanguage = "en") {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const translatedAbility = data.names.find(
      (name) => name.language.name === language
    );
    if (translatedAbility) {
      return translatedAbility.name;
    } else {
      const fallbackAbility = data.names.find(
        (name) => name.language.name === fallbackLanguage
      );
      return fallbackAbility ? fallbackAbility.name : null;
    }
  } catch (error) {
    console.error(`Error fetching translated ability data from ${url}:`, error);
    return null;
  }
}

// Fetch translated type data from API
async function fetchTranslatedType(url, language, fallbackLanguage = "en") {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const translatedType = data.names.find(
      (name) => name.language.name === language
    );
    if (translatedType) {
      return translatedType.name;
    } else {
      const fallbackType = data.names.find(
        (name) => name.language.name === fallbackLanguage
      );
      return fallbackType ? fallbackType.name : null;
    }
  } catch (error) {
    console.error(`Error fetching translated type data from ${url}:`, error);
    return null;
  }
}

// Fetch translated move data from API
async function fetchTranslatedMove(url, language, fallbackLanguage = "en") {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const translatedMove = data.names.find(
      (name) => name.language.name === language
    );
    if (translatedMove) {
      return translatedMove.name;
    } else {
      const fallbackMove = data.names.find(
        (name) => name.language.name === fallbackLanguage
      );
      return fallbackMove ? fallbackMove.name : null;
    }
  } catch (error) {
    console.error(`Error fetching translated move data from ${url}:`, error);
    return null;
  }
}

// Check if the Pokémon has an evolved form
async function isEvolvedForm(speciesUrl) {
  try {
    const response = await fetch(speciesUrl);
    const data = await response.json();
    return data.evolves_from_species !== null;
  } catch (error) {
    console.error(`Error checking evolved form from ${speciesUrl}:`, error);
    return false;
  }
}

// Create a Pokemon card element
async function createPokemonCard(id, language, controller) {
  try {
    if (controller.signal.aborted) return; // Check if the request has been aborted

    // Fetch Pokémon data
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
      signal: controller.signal,
    });
    const data = await response.json();

    // Fetch species data and translated name
    const speciesResponse = await fetch(data.species.url, {
      signal: controller.signal,
    });
    const speciesData = await speciesResponse.json();
    const translatedName = await fetchTranslatedData(
      data.species.url,
      language
    );

    // Skip if translation for name is not found
    if (!translatedName) {
      console.warn(
        `Translation not found for Pokemon ID: ${id} in language: ${language}`
      );
      return;
    }

    // Check if the Pokémon has an evolved form
    const evolved = await isEvolvedForm(data.species.url);

    // Fetch abilities, types, and moves data
    const abilities = await Promise.all(
      data.abilities.map(async (ability) => {
        const translatedAbility = await fetchTranslatedAbility(
          ability.ability.url,
          language
        );
        return translatedAbility || ability.ability.name;
      })
    );

    const types = await Promise.all(
      data.types.map(async (type) => {
        const translatedType = await fetchTranslatedType(
          type.type.url,
          language
        );
        return translatedType || type.type.name;
      })
    );

    const moves = await Promise.all(
      data.moves.slice(0, 3).map(async (move) => {
        const translatedMove = await fetchTranslatedMove(
          move.move.url,
          language
        );
        return translatedMove || move.move.name;
      })
    );

    // Create card element
    const card = document.createElement("div");

    //add all classes to the card
    if (data.types.length > 1) {
      let gradient = `linear-gradient(to right`;

      data.types.forEach((type) => {
        const color = typeColors.get(type.type.name);
        gradient += `, ${color}`;
      });

      gradient += `)`;
      console.log(gradient);
      card.style.background = gradient;
    } else {
      card.style.backgroundColor = typeColors.get(data.types[0].type.name);
    }

    card.classList.add("card");
    //set the index of the card for staggered animation
    card.style.setProperty("--index", id);

    if (evolved) {
      card.classList.add("evolved");
    }

    // Populate card with data
    const img = document.createElement("img");
    img.src = data.sprites.front_default;
    img.alt = translatedName;
    card.appendChild(img);

    const number = document.createElement("p");
    number.textContent = `#${data.id.toString().padStart(3, "0")}`;
    card.appendChild(number);

    const name = document.createElement("h2");
    name.textContent = translatedName;
    card.appendChild(name);

    const typeElement = document.createElement("p");
    typeElement.textContent = `${translations[language].type}: ${types.join(
      ", "
    )}`;
    card.appendChild(typeElement);

    const movesElement = document.createElement("p");
    movesElement.textContent = `${translations[language].moves}: ${moves.join(
      ", "
    )}`;
    card.appendChild(movesElement);

    // Add card to the row
    row.appendChild(card);

    // Event listener for card click
    card.addEventListener("click", () => {
      document.getElementById("pokemon-name").innerHTML = translatedName;
      document.getElementById("pokemon-image").src = data.sprites.front_default;
      document.getElementById("abilities").innerHTML = abilities.join(", ");

      const heldItems =
        data.held_items.length === 0
          ? "/"
          : data.held_items
              .map((item) => item.item.name)
              .slice(0, 3)
              .join(", ");
      document.getElementById("held_items").innerHTML = heldItems;

      document.getElementById("type").innerHTML = types.join(", ");
      document.getElementById("moves").innerHTML = moves.join(", ");
      document.getElementById("weight").innerHTML = data.weight / 10 + " kg";
      document.getElementById("cries").src = data.cries
        ? data.cries.latest
        : ""; // Assuming cries URL exists in the data
      document.getElementById("info-window-wrapper").style.display = "flex";
    });
  } catch (error) {
    // Handle errors
    if (error.name === "AbortError") {
      console.log(`Request for Pokemon ID: ${id} aborted`);
    } else {
      console.error(`Error creating Pokemon card for ID: ${id}`, error);
    }
  }
}

// Create Pokemon cards for a given language
async function createPokemonCards(language = "en") {
  // Abort previous request if active
  if (activeRequestController) {
    activeRequestController.abort();
  }

  // Initialize new abort controller
  activeRequestController = new AbortController();
  const controller = activeRequestController;

  // Clear previous cards
  row.innerHTML = "";

  // Clear infoWindow content
  const infoWindow = document.getElementById("info-window-content");
  infoWindow.innerHTML = "";

  // Create close button
  const closingBtn = document.createElement("button");
  closingBtn.textContent = translations[language].close;
  closingBtn.id = "closing-button";
  infoWindow.appendChild(closingBtn);

  // Create Pokemon name and image elements
  const pokemonName = document.createElement("h1");
  pokemonName.id = "pokemon-name";
  const pokemonImage = document.createElement("img");
  pokemonImage.id = "pokemon-image";
  infoWindow.appendChild(pokemonName);
  infoWindow.appendChild(pokemonImage);

  // Close button event listener
  document.getElementById("closing-button").addEventListener("click", () => {
    document.getElementById("info-window-wrapper").style.display = "none";
  });

  // Create table structure for Pokemon details
  const table = document.createElement("table");
  infoWindow.appendChild(table);

  // Template for Pokemon details
  const template = `<tr>
            <th>${translations[language].abilities}</th>
            <td id="abilities"></td>
        </tr>
        <tr>
            <th>${translations[language].held_items}</th>
            <td id="held_items"></td>
        </tr>
        <tr>
            <th>${translations[language].type}</th>
            <td id="type"></td>
        </tr>
        <tr>
            <th>${translations[language].moves}</th>
            <td id="moves"></td>
        </tr>
        <tr>
            <th>${translations[language].weight}</th>
            <td id="weight"></td>
        </tr>
        <tr>
            <th>${translations[language].cry}</th>
            <td>
                <audio controls src="" id="cries" style="height: 25px; width: 100%;"></audio>
            </td>
        </tr>`;
  table.innerHTML = template;

  // Create Pokemon cards for IDs 1 to 1008
  for (let i = 1; i <= 1008; i++) {
    await createPokemonCard(i, language, controller);
  }
}

// Event listener for language select change
languageSelect.addEventListener("change", (event) => {
  const selectedLanguage = event.target.value;
  if (currentLanguage !== selectedLanguage) {
    currentLanguage = selectedLanguage;
    createPokemonCards(selectedLanguage);
  }
});

// Initialize with default language
createPokemonCards();
