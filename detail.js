// consts and import vars
let currentPkmnID = null;
const MAX_PKMN = 1400;
const typeColours = {
    normal : "#B0ABAE",
    dragon : "#246A73",
    fire : "#ed5c5c",
    fairy : "#FFCAD4",
    water : "#05B2DC",
    grass : "#43AA8B",
    electric : "#F8E16C",
    steel : "#759595",
    flying : "#B0D0D3",
    rock : "#C1AE9F",
    ground : "#DB995A",
    poison : "#724E91",
    bug : "#59CD90",
    ice : "#ABEBD2",
    psychic : "#CB429F",
    dark : "#22162B",
    ghost : "#451F55",
    fighting : "#A8A878"
}

// when document is loaded, make sure pkmn is valid
document.addEventListener("DOMContentLoaded", () => {
    const pokemonID = new URLSearchParams(window.location.search).get("id");
    const id = parseInt(pokemonID, 10);
    if (id < 1 || id > MAX_PKMN) {
        return (window.location.href = "./index.html");
    }
    currentPkmnID = id;
    loadPokemon(id);
});

// load the pkmn details in
async function loadPokemon(id) {
    try {
        // get pkmn data from api
        const [pokemon, pokemonSpecies] = await Promise.all([fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((res) => res.json()),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
        .then((res) => res.json()),
        ]);
        const evolution = await fetch(`${pokemonSpecies.evolution_chain.url}`).then((res) => res.json());

        const evolutionChain = evolution.chain;

        const abilitiesWrapper = document.querySelector(".pkmnDetailWrap .pkmnDetail.move");

        // reset previous text
        if (abilitiesWrapper) {
            abilitiesWrapper.innerHTML = "";
            document.querySelector(".evolution").textContent = ""
        }

        // display
        if (currentPkmnID === id) {
            displayPkmnDetails(pokemon, pokemonSpecies, evolutionChain);
            const flavourText = getEnglishFlavour(pokemonSpecies);
            document.querySelector(".body3-font.pkmnDescription").textContent = flavourText;

            // moving between pkmn
            const leftArrow = document.getElementById("leftArrow");
            const rightArrow = document.getElementById("rightArrow");
            leftArrow.removeEventListener("click", navigatePkmn);
            rightArrow.removeEventListener("click", navigatePkmn);
            if (id !== 1) {
                leftArrow.addEventListener("click", () => {
                    navigatePkmn(id - 1);
                });
            }
            if (id !== MAX_PKMN) {
                rightArrow.addEventListener("click", () => {
                    navigatePkmn(id + 1);
                });
            }
            window.history.pushState({}, "", `./detail.html?id=${id}`);
        }
        return true;
    } catch (error) {
        console.error("Error occured while fetching pokemon data:", error);
        return false;
    }
}

// move to next pkmn
async function navigatePkmn(id) {
    currentPkmnID = id;
    await loadPokemon(id);
}

// shortcut to set css properties
function setElementStyles(elements, cssProperty, value) {
    elements.forEach((element) => {
        element.style[cssProperty] = value;
    });
}

// change colours to pkmn specific ones
function setTypeColour(pokemon) {
    const mainType = pokemon.types[0].type.name;
    const colour = typeColours[mainType];
    if (!colour) {
        console.warn(`Colour not defined for type: ${mainType}`);
    }

    const detailMainElement = document.querySelector(".detailMain");
    if (pokemon.types.length === 1) {
        detailMainElement.style.background =   `linear-gradient(${colour}, #ffffff)`;
    } else {
        const colour2 = typeColours[pokemon.types[1].type.name];
        detailMainElement.style.background =   `linear-gradient(${colour}, ${colour2})`;
        
    }
    setElementStyles([detailMainElement], "borderColor", colour);

    setElementStyles(document.querySelectorAll(".powerWrapper > p"), "backgroundColor", colour);
    setElementStyles(document.querySelectorAll(".statsWrap p.stats"), "color", colour);
    setElementStyles(document.querySelectorAll(".statsWrap .progressBar"), "backgroundColor", colour);

    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
    .statsWrap .progressBar::-webkit-progress-bar {
        background-color: rgb(240,240,240);
    }
    .statsWrap .progressBar::-webkit-progress-value {
        background-color: ${colour};
    }
    `

    document.head.appendChild(styleTag);
}

// shortcut to capitalize
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// display function
function displayPkmnDetails(pokemon, pokemonSpecies, evolutionChain) {
    const {name, id, types, weight, height, abilities, stats} = pokemon;
    const nameCap = capitalize(name);
    const detailMainElement = document.querySelector(".detailMain");

    detailMainElement.classList.add(name.toLowerCase());
    document.querySelector(".nameWrap .name").textContent = nameCap;
    document.querySelector(".pokemonIDWrap .body2-font").textContent = `${String(id).padStart(3, "0")}`;

    // output pkmn image and basic info
    const imageElement = document.querySelector(".detailIMGWrapper img");
    imageElement.src = `https://img.pokemondb.net/sprites/home/normal/${name}.png`;
    const typeWrapper = document.querySelector(".powerWrap");
    typeWrapper.innerHTML = "";
    types.forEach((type) => {
        createAppendElement(typeWrapper, "p", {
            clasName: `body3-font type ${capitalize(type.type.name)}`,
            textContent: type.type.name,
        });
    });

    // about section
    document.querySelector(".pkmnDetailWrap .pkmnDetail p.body3-font.weight").textContent = `${weight / 10 } kg`;
    document.querySelector(".pkmnDetailWrap .pkmnDetail p.body3-font.height").textContent = `${height / 10 } m`;
    const abilitiesWrapper = document.querySelector(".pkmnDetailWrap .pkmnDetail.move");
    abilities.forEach(({ability}) => {
        createAppendElement(abilitiesWrapper, "p", {
            className: "body3-font",
            textContent: ability.name
        });
    });

    // base stats
    const statsWrapper = document.querySelector(".statsWrapper");
    statsWrapper.innerHTML = "";
    const statNameMap = {
        hp : "HP",
        attack : "ATK",
        defense : "DEF",
        "special-attack" : "SPATK",
        "special-defense" : "SPDEF",
        speed : "SPEED",
    }

    stats.forEach(({stat, base_stat}) => {
        const statDiv = document.createElement("div");
        statDiv.className = "statsWrap";
        statsWrapper.appendChild(statDiv);
        createAppendElement(statDiv, "p", {
            className : "body3-font stats",
            textContent : statNameMap[stat.name]
        });

        createAppendElement(statDiv, "p", {
            className : "body3-font",
            textContent : String(base_stat).padStart(3, "0")
        });

        createAppendElement(statDiv, "progress", {
            className : "progressBar",
            value : base_stat,
            max : 230,
        });
    });

    setTypeColour(pokemon);

    // evolution
    firstEvoID = parseInt(getID(evolutionChain.species.url));
    if (evolutionChain.evolves_to.length === 1) {
        if (evolutionChain.evolves_to[0].evolves_to.length === 1) {
            document.querySelector(".evolution").innerHTML = `
            <a href="./detail.html?id=${firstEvoID}">${capitalize(evolutionChain.species.name)}</a>${" -> "}<a href="./detail.html?id=${firstEvoID + 1}">${capitalize(evolutionChain.evolves_to[0].species.name)}</a>${" -> "} <a href="./detail.html?id=${firstEvoID + 2}">${capitalize(evolutionChain.evolves_to[0].evolves_to[0].species.name)}</a>`;
        } else {
            document.querySelector(".evolution").innerHTML = `
            <a href="./detail.html?id=${firstEvoID}">${capitalize(evolutionChain.species.name)}</a> ${" -> "} <a href="./detail.html?id=${firstEvoID + 1}">${capitalize(evolutionChain.evolves_to[0].species.name)}`;
        }
    } else {
        document.querySelector(".evolution").innerHTML = `<a href="./detail.html?id=${firstEvoID}">${capitalize(evolutionChain.species.name)}</a>`;
    }
}

// find the id/pokedex number of pokemon using its url
function getID(url) {
    let id = url.slice(42);
    let backslashIndex = 0;
    for (let i = 0; i < id.length; i++) {
        console.log(id.charAt(i));
        if (id.charAt(i) < "0" || id.charAt(i) > "9") {
            backslashIndex = i;
        }
    }
    id = id.slice(0, backslashIndex);
    return id;
}

// flavour text from api
function getEnglishFlavour(pokemonSpecies) {
    for (let entry of pokemonSpecies.flavor_text_entries) {
        if (entry.language.name === "en") {
            let flavour = entry.flavor_text.replace(/\f/g, " ")
            return flavour;
        }
    }
    return "";
}

// add element to a parent element
function createAppendElement(parent, tag, options = {}) {
    const element = document.createElement(tag);
    Object.keys(options).forEach((key) => {
        element[key] = options[key];
    });
    parent.appendChild(element);
    return element;
  }
