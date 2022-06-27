const SCRYFALL_API_RANDOM = "https://api.scryfall.com/cards/random"

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function displayCard(x) {

}


async function fetchScryfall() {
    let response = await fetch(SCRYFALL_API_RANDOM);
    let data = await response.json();
    // let {name, scryfall_uri, image_uris, set, set_name, rarity} = data;
    // return name, scryfall_uri, image_uris, set, set_name, rarity;
    return data;
}

async function getCards() {
    let ammount = document.getElementById("ammount").value;
    
    for (let i = 0; i < ammount; i++) {
        let card = await fetchScryfall();

        sleep(150);

        // console.log(card);
        console.log(card.name);
        console.log(card.scryfall_uri)
        document.getElementById("simple-card-output").innerHTML += `<li><a href="${card.scryfall_uri}" target="_blank" rel="noopener noreferrer">${card.name}</a></li>`;
        // displayCard(card);
    }
}
