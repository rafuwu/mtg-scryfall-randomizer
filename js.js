const SCRYFALL_API_RANDOM = "https://api.scryfall.com/cards/random?q="

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getSearchQuery() {
    let query_plain = document.getElementById("scryfall-api-search-query").value
    console.log(query_plain)
    let query_URI = encodeURIComponent(query_plain)
    console.log(query_URI)
    return query_URI
}

async function fetchScryfall(query) {
    let response = await fetch(SCRYFALL_API_RANDOM + query);
    let data = await response.json();
    // let {name, scryfall_uri, image_uris, set, set_name, rarity} = data;
    // return name, scryfall_uri, image_uris, set, set_name, rarity;
    return data;
}

function displayInSimpleList(card) {
    document.getElementById("simple-card-output").innerHTML += `<li><a href="${card.scryfall_uri}" target="_blank" rel="noopener noreferrer"><strong>${card.name}</strong></a> <span class="simple-list-set"> <a href="${card.scryfall_set_uri}" target="_blank" rel="noopener noreferrer">(<abbr title="${card.set_name}">${card.set.toUpperCase()}</abbr>)</a> </span> </li>`;
}

function displayInTable(card) {
    document.getElementById("table-output").innerHTML += `<tr>
    <td><a href="${card.scryfall_uri}" target="_blank" rel="noopener noreferrer"> ${card.name} </a></td>
    <td><a href="${card.scryfall_set_uri}" target="_blank" rel="noopener noreferrer"> ${card.set_name}</a> (${card.set.toUpperCase()})</td>
    <td>${card.rarity}</td>
    <td><a href="${card.image_uris.large}" target="_blank" rel="noopener noreferrer"><img src="${card.image_uris.small}" alt="Card image" referrerpolicy="no-referrer"></a></td>
</tr>`
}

async function getCards() {
    let ammount = document.getElementById("ammount").value;

    let query = getSearchQuery()
    
    for (let i = 0; i < ammount; i++) {
        let card = await fetchScryfall(query);

        console.log(card.name);
        console.log(card.scryfall_uri)

        displayInSimpleList(card)
        displayInTable(card)

        sleep(6000);
    }
}
