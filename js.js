/* const params = new URLSearchParams(window.location.search);

const mtg_set = params.get("set");

console.log(mtg_set); */


/* function getexp() {
    console.log("year: " + document.getElementById('year').value)
    console.log("set: " + document.getElementById('set').value)

    let scryfall_exp = `set:${set} -(t:land legal:standard)`
} */

const API_SCRYFALL_RANDOM = "https://api.scryfall.com/cards/random"

/* function scryfall_fetch() {
    scryfall_expression = document.getElementById('scryfall-exp').value;
    scryfall_expression_uri = escape(scryfall_expression)
    console.log(`https://api.scryfall.com/cards/random?q=${scryfall_expression_uri}`);
    
    fetch(`https://api.scryfall.com/cards/random?q=${scryfall_expression_uri}`, { mode: 'no-cors'} )
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        console.log(response.json());
        return response.json();
    })
    .then(json => {
        console.log("JSON!!!" + json);
    })
    .catch(function (error) {
        console.error("ERROR");
        console.error(error);
    })
    
}; */

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function displayCard(x) {

}


async function fetchScryfall() {
    let response = await fetch(API_SCRYFALL_RANDOM);
    let data = await response.json();
    // let {name, scryfall_uri, image_uris, set, set_name, rarity} = data;
    // return name, scryfall_uri, image_uris, set, set_name, rarity;
    console.log(data.name);
    return data;
}

async function getCards() {
    let loop_number = document.getElementById("random-gen-ammount").value;
    for (let i = 0; i < loop_number; i++) {
        let card = await fetchScryfall();
        sleep(150);
        // console.log(card);
        console.log(card.name);
        // displayCard(card);
    }
}
