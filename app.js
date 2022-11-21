import {addCardToList as editCardList, downloadCod, downloadDec, copyDecToClipboard} from "./deck.js"

document.getElementById("scryfall-api-search-query").value = localStorage.getItem("query");

// Buttons
const btn_get_cards = document.getElementById("random-gen-get")
const btn_download_cod = document.getElementById("btn-download-cod")
const btn_download_dec = document.getElementById("btn-download-dec")
const btn_copytoclip = document.getElementById("btn-copytoclip")
const btn_clear_lists = document.getElementById("btn-clear-lists")
const counter_current = document.getElementById("counter-current")
const counter_total = document.getElementById("counter-total")


const SCRYFALL_API_RANDOM = "https://api.scryfall.com/cards/random?q="

let time_performance_array = new Array



// Function to get the query (user input) from the form. (Local)
// RETURNS: 'query' object (.plain and .uri)
function getSearchQuery() {
    let query = new Object
    query.plain = document.getElementById("scryfall-api-search-query").value
    query.uri = encodeURIComponent(query.plain)

    if (query.plain == "")  console.info("Query is empty")
    else                    console.log("Query object: ", query)

    localStorage.setItem("query", query.plain);

    return query
}


// Primary function to fetch card data, given the query.
// RETURNS: Card JSON
async function fetchScryfall(query) {
    let response = await fetch(SCRYFALL_API_RANDOM + query);
    let data = await response.json();
    // let {name, scryfall_uri, image_uris, set, set_name, rarity} = data;
    // return name, scryfall_uri, image_uris, set, set_name, rarity;
    return data;
}

// For when cards have 2 faces
// Example: https://scryfall.com/card/znr/120/pelakka-predation-pelakka-caverns
// RETURNS: Array with image URIs
function getImageUris(card) {
    if (["transform", "modal_dfc", "double_faced_token", "art_series"].includes(card.layout)) {
        try {
            let image_uris = [card.card_faces[0].image_uris, card.card_faces[1].image_uris]
            return image_uris
        } catch (error) {
            console.error(error)
        }
    } else {
        try {
            let image_uris = [card.image_uris]
            return image_uris
        } catch (error) {
            console.error(error)
        }
    }
}


// This function displays the information it's given to a simple list. Doesn't return anything.
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


// This function displays the information it's given to a table. Doesn't return anything.
function displayInTable(card, image_uris) {
    let images_td = ""

    for (let i = 0; i < image_uris.length; i++) {
        images_td = `${images_td} <a href="${image_uris[i].large}" target="_blank" rel="noopener noreferrer"><img src="${image_uris[i].small}" alt="Card image" referrerpolicy="no-referrer"></a>`
    }

    document.getElementById("table-output").innerHTML += `
<tr>
    <td><a href="${card.scryfall_uri}" target="_blank" rel="noopener noreferrer"> ${card.name} </a></td>
    <td><a href="${card.scryfall_set_uri}" target="_blank" rel="noopener noreferrer"> ${card.set_name}</a> (${card.set.toUpperCase()})</td>
    <td class="table-center">${card.type_line.split(" — ")[0]}</a></td>
    <td class="table-center">${card.rarity}</td>
    <td class="table-center">${images_td}</td>
</tr>`
}


// https://www.geeksforgeeks.org/how-to-get-median-of-an-array-of-numbers-in-javascript/
function medianOfArr(arr) {
    let concat = arr;

    concat = concat.sort(
        function (a, b) { return a - b });

    let length = concat.length;

    if (length % 2 == 1) {
        return concat[(length / 2) - .5]
    }
    else { 
        return (concat[length / 2] + concat[(length / 2) - 1]) / 2;
    }
}


function displayTime(time) {
    if (time == 0) {
        time_performance_array = []
    } else {
        time_performance_array.push(time)
        let time_median = medianOfArr(time_performance_array)
    
        document.getElementById("perf-average").innerHTML = `${time_median} ms`
    }
}


// Helper function that calls other functions responsible for fetching data and displaying it, and more. Doesn't return anything.
async function helperFetchAndDisplay(query) {
    let a = performance.now()
        let card = await fetchScryfall(query.uri)
    let b = performance.now()
    displayTime(Math.round(b - a))

    console.groupCollapsed("🎴 New card: ", card.name)
    console.table({
        "Name":card.name,
        "Rarity":card.rarity,
        "Set code":card.set,
        "Set name":card.set_name,
        "Scryfall URI (card)":card.scryfall_uri,
        "Scryfall URI (set)":card.scryfall_set_uri
    }); console.groupEnd()

    try {
        editCardList(card)
        
    } catch (error) {
        console.error(error)
    }

    
    displayInSimpleList(card)
    displayInTable(card, getImageUris(card))
    
    counter_current.innerHTML = parseInt(counter_current.innerHTML) + 1
}


// This function is triggered when the button to get cards is pressed.
// It stores the query in a variable and passes it to an helper function for fetching the data and displaying it. Doesn't return anything.
btn_get_cards.addEventListener("click", function() {
    let ammount = document.getElementById("ammount").value;
    if (ammount < 1) return
    
    counter_total.innerHTML = parseInt(counter_total.innerHTML) + parseInt(ammount);

    let query = getSearchQuery()
    
    displayTime(0)

    if (ammount == 1) {
        helperFetchAndDisplay(query)
    } else {
        helperFetchAndDisplay(query)
        
        for (let i = 0; i < ammount-1; i++) {
            setTimeout( async () => {
                helperFetchAndDisplay(query)
              }, "200") // https://scryfall.com/docs/api
        }               // "We kindly ask that you insert 50 – 100
    }                   // milliseconds of delay between
}, false);              // the requests you send to the server"


// This function is triggered when the button to download a .cod file is pressed. It calls a function to do so. Doesn't return anything.
btn_download_cod.addEventListener("click", function() {
    if (editCardList(1).length === 0) return
    downloadCod()
}, false);

// This function is triggered when the button to download a .dec file is pressed. It calls a function to do so. Doesn't return anything.
btn_download_dec.addEventListener("click", function() {
    if (editCardList(1).length === 0) return
    downloadDec()
}, false);

// This function is triggered when the button to download a .dec file is pressed. It calls a function to do so. Doesn't return anything.
btn_copytoclip.addEventListener("click", function() {
    if (editCardList(1).length === 0) return
    copyDecToClipboard()
}, false);


// This function is triggered when the button to clear lists is pressed. It does so. Doesn't return anything.
btn_clear_lists.addEventListener("click" , () => {
    if (editCardList(1).length === 0) return

    if (confirm("Clear lists? THIS WILL DELETE ALL CONTENT.")) {
        try {
            editCardList(0)
        } catch (error) {
            console.error(error)
        }
        counter_total.innerHTML = counter_current.innerHTML = "0"
        document.getElementById("table-output").innerHTML = "<tr><th>Card name</th><th>Set</th><th>Type</th><th>Rarity</th><th>Image</th></tr>"
        document.getElementById("simple-card-output").innerHTML = ""
    }
})


// Request confirmation for exiting or reloading the page if the form is filled
window.addEventListener('beforeunload', function (e) {

    if (document.getElementById("scryfall-api-search-query").value !== '') {

        e.preventDefault();
        e.returnValue = '';
    }
});
