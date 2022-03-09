/* const params = new URLSearchParams(window.location.search);

const mtg_set = params.get("set");

console.log(mtg_set); */


/* function getexp() {
    console.log("year: " + document.getElementById('year').value)
    console.log("set: " + document.getElementById('set').value)

    let scryfall_exp = `set:${set} -(t:land legal:standard)`
} */

function scryfall_fetch() {
    scryfall_expression = document.getElementById('scryfall-exp').value;
    scryfall_expression_uri = escape(scryfall_expression)
    console.log(`https://api.scryfall.com/cards/random?q=${scryfall_expression_uri}`);
    for (let i=0; i<document.getElementById('random-gen-ammount').value;i++) {
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
    .catch(function () {
        this.dataError = true;
    })
    }
    
};