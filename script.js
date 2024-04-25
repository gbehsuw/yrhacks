// Authour : Mithulan Nanthakumar 
// Date : April 17th, 2024
// Description : Pokedex

// CONSTANTS
const MAX_PKMN = 1400;
const listWrapper = document.querySelector(".listWrapper");
const searchInput = document.querySelector("#searchInput");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#notFoundMessage");
const closeButton = document.querySelector(".searchCloseIcon");

// IMPORTANT VARIABLES
let allPkmn = [];

// get api data
fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_PKMN}`)
.then((response) => response.json())
.then((data) => {
    allPkmn = data.results;
    displayPkmn(allPkmn);
})

// load pkmn with async
async function fetchPkmnDataPreRedirect(id) {
    try {
        const [pokemon, pokemonSpecies] = await Promise.all([fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((res) => res.json()),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
        .then((res) => res.json())
        ]);
        return true;
    } catch (error) {
        console.error("Failed to fetch data.");
    }
}

// display pkmn card
function displayPkmn(pokemon) {
    listWrapper.innerHTML = "";
    pokemon.forEach((pokemon) => {
        const pokemonID = pokemon.url.split("/")[6];
        const listItem = document.createElement("div");
        listItem.className = "listItem";
        listItem.innerHTML = `
            <div class="numberWrap">
                <p class="captionFont">#${pokemonID}</p>
            </div>
            <div class="imgWrap">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
            </div>
            <div class="nameWrap">
                <p class="body3-font">${pokemon.name}</p>
            </div>
        `;
        listItem.addEventListener("click", async () => {
            const success = await fetchPkmnDataPreRedirect(pokemonID);
            if (success) {
                window.location.href = `./detail.html?id=${pokemonID}`;
            }
        });
        listWrapper.appendChild(listItem);
    });
}

// search feature
searchInput.addEventListener("keyup", handleSearch);
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    let filteredPokemons;

    // check for filtered pkmn
    if (numberFilter.checked) {
        filteredPokemons = allPkmn.filter((pokemon) => {
            const pokemonID = pokemon.url.split("/")[6];
            if (pokemonID < MAX_PKMN) {
                return pokemonID.startsWith(searchTerm);
            }
        });
    } else if (nameFilter.checked) {
        filteredPokemons = allPkmn.filter((pokemon) => {
            const pokemonID = pokemon.url.split("/")[6];
            if (pokemonID < MAX_PKMN) {
                console.log(pokemonID);
                return pokemon.name.toLowerCase().startsWith(searchTerm);
            }
        });
    } else {
        filteredPokemons = allPkmn;
    }

    displayPkmn(filteredPokemons);

    // if no pkmn matches, show no pokemon found text
    if (filteredPokemons.length === 0) {
        notFoundMessage.style.display = "block";
    } else {
        notFoundMessage.style.display = "none";
    }
}

// clear search
closeButton.addEventListener("click", clearSearch);
function clearSearch() {
    searchInput.value = "";
    displayPkmn(allPkmn);
    notFoundMessage.style.display = "none";
}
