import {addCardToList, downloadCod} from "./cockatrice_deck_saver.js"


const btn_get_cards = document.getElementById("random-gen-get")
const btn_download_cod = document.getElementById("btn-download-cod")
const counter_current = document.getElementById("counter-current")
const counter_total = document.getElementById("counter-total")


const SCRYFALL_API_RANDOM = "https://api.scryfall.com/cards/random?q="


function debug(card, query) {
    let general_debug_table = {
        "query.plain" : query.plain,
        "query.URI" : query.URI,
        "card.name" : card.name,
        "card.rarity" : card.rarity,
        "card.set" : card.set,
        "card.set_name" : card.set_name,
        "card.scryfall_uri" : card.scryfall_uri,
        "card.scryfall_set_uri" : card.scryfall_set_uri,
    }

    console.table(general_debug_table)
}

function getSearchQuery() {
    let query_plain = document.getElementById("scryfall-api-search-query").value
    let query_URI = encodeURIComponent(query_plain)

    let query = {
        "plain": query_plain,
        "URI": query_URI,
    }

    if (query_plain == "")  console.info("Query is null")
    else                    console.table(query)

    return query
}

async function fetchScryfall(query) {
    let response = await fetch(SCRYFALL_API_RANDOM + query);
    let data = await response.json();
    // let {name, scryfall_uri, image_uris, set, set_name, rarity} = data;
    // return name, scryfall_uri, image_uris, set, set_name, rarity;
    return data;
}

// For when cards have 2 faces
// Example: https://scryfall.com/card/znr/120/pelakka-predation-pelakka-caverns
function getImageUris(card) {
    try {
        let image_uris = [card.card_faces[0].image_uris, card.card_faces[1].image_uris]
        console.log("Card has 2 faces")
        return image_uris
    } catch (error) {
        console.log("Card has 1 face")
        let image_uris = [card.image_uris]
        return image_uris
    }
}

function displayInSimpleList(card) {
    document.getElementById("simple-card-output").innerHTML += `
<li>
    <a href="${card.scryfall_uri}" target="_blank" rel="noopener noreferrer">
        <strong>${card.name}</strong>
    </a>
    <span class="simple-list-set">
        <a href="${card.scryfall_set_uri}" target="_blank" rel="noopener noreferrer">
            (<abbr title="${card.set_name}">${card.set.toUpperCase()}</abbr>)
        </a>
    </span>
</li>`;
}

function displayInTable(card, image_uris) {
    if (image_uris.length > 1) {
        var images_td = `<a href="${image_uris[0].large}" target="_blank" rel="noopener noreferrer"><img src="${image_uris[0].small}" alt="Card image" referrerpolicy="no-referrer"></a> <a href="${image_uris[1].large}" target="_blank" rel="noopener noreferrer"><img src="${image_uris[1].small}" alt="Card image" referrerpolicy="no-referrer"></a>`
    } else {
        var images_td = `<a href="${image_uris[0].large}" target="_blank" rel="noopener noreferrer"><img src="${image_uris[0].small}" alt="Card image" referrerpolicy="no-referrer"></a>`
    }

    document.getElementById("table-output").innerHTML += `
<tr>
    <td><a href="${card.scryfall_uri}" target="_blank" rel="noopener noreferrer"> ${card.name} </a></td>
    <td><a href="${card.scryfall_set_uri}" target="_blank" rel="noopener noreferrer"> ${card.set_name}</a> (${card.set.toUpperCase()})</td>
    <td class="table-center">${card.type_line.split(" ??? ")[0]}</a></td>
    <td class="table-center">${card.rarity}</td>
    <td class="table-center">${images_td}</td>
</tr>`
}

async function helperFetchAndDisplay(query) {
    let card = await fetchScryfall(query.URI)

    try {
        addCardToList(card)
        
    } catch (error) {
        console.log(error)
    }

    debug(card, query)
    
    displayInSimpleList(card)
    displayInTable(card, getImageUris(card))
    
    counter_current.innerHTML = parseInt(counter_current.innerHTML) + 1
}

btn_get_cards.addEventListener("click", function() {
    let ammount = document.getElementById("ammount").value;
    
    counter_total.innerHTML = parseInt(counter_total.innerHTML) + parseInt(ammount);

    let query = getSearchQuery()
    
    if (ammount == 1) {
        helperFetchAndDisplay(query)
    } else {
        helperFetchAndDisplay(query)
        
        for (let i = 0; i < ammount-1; i++) {
            setTimeout( async () => {
                helperFetchAndDisplay(query)
              }, "200") // https://scryfall.com/docs/api
        }               // "We kindly ask that you insert 50 ??? 100
    }                   // milliseconds of delay between
}, false);              // the requests you send to the server"

btn_download_cod.addEventListener("click", function() {
    downloadCod()
}, false);  

// Request confirmation for exiting or reloading the page if the form is filled
window.addEventListener('beforeunload', function (e) {

    if (document.getElementById("scryfall-api-search-query").value !== '') {

        e.preventDefault();
        e.returnValue = '';
    }
});
