const COCKATRICE_DECK_FILE_TEMPLATE = `<?xml version="1.0" encoding="UTF-8"?>
<cockatrice_deck version="1">
    <deckname>{DECKNAME}</deckname>
    <comments>{COMMENTS}</comments>
    <zone name="main">
        {CARDS}
    </zone>
</cockatrice_deck>
`

const COCKATRICE_DECK_CARD_TEMPLATE = '<card number="{NUMBER}" name="{NAME}"/>'

let card_list = new Array


// Function to download data to a file. Doesn't return anything.
function download(text, filename, type) {
    var file = new Blob([text], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

// Adds leading zeros so that numbers have two digits.
// RETURNS: Two-digit number
function addLeadingZeros(x) {
    if (x < 10) {
        x = "0" + x
    }

    return x
}


// Defines date.
// RETURNS: date (string)
function defineDate() {
    // https://www.w3schools.com/jsref/jsref_obj_date.asp
    let d = new Date()
    let year = d.getFullYear()
    let month = addLeadingZeros(d.getMonth()+1)
    let day = addLeadingZeros(d.getDate())
    let hour = addLeadingZeros(d.getHours())
    let minutes = addLeadingZeros(d.getMinutes())
    let seconds = addLeadingZeros(d.getSeconds())

    let date = `${year}-${month}-${day}_${hour}-${minutes}-${seconds}`
    console.log(date)

    return date
}


// Adds given card (name) to the card array list, later used for downloading a Cockatrice deck.
// If the input is the number 0, it empties the list.
// RETURNS: card_list
function addCardToList(card) {
    if (card === 0) {
        card_list = []
    } else {
        card_list.push(card.name)
    }
    
    console.log(card_list)

    return card_list
}


// This function creates a complex list of cards that stores cards only once along with its count.
// This complex list is used for generating a Cockatrice deck and is only generated once per needed deck creation.
// RETURNS: card_list_complex (Array)
function createComplexCardList() {
    let card_list_complex = new Array
    /*   ------- Array example ------- 
     *
     *   [
     *       {
     *           "number" : 3,
     *           "name" : "Example 1"
     *       },
     *       {
     *           "number" : 1,
     *           "name" : "Example 2"
     *       }
     *   ]
    */

    for (let i = 0; i < card_list.length; i++) {
        // If card_list[i] doesn't exist somewhere in the array of objects that is card_list_complex, add it
        if (!card_list_complex.some(elem => elem.name === card_list[i])) {
            card_list_complex.push({
                "number" : 1,
                "name" : card_list[i]
            })
        } else { // If if exists already somewhere, find it and add +1 to the counter
            for (let j = 0; j < card_list_complex.length; j++) {
                if (card_list_complex[j].name == card_list[i]) {
                    card_list_complex[j].number += 1
                    break
                }
                
            }
        }
        
    }

    console.log(card_list_complex)
    console.table(card_list_complex)

    return card_list_complex
}


function cockatrice_deckCards(card_list_complex) {
    let cockatrice_deck_cards_array = new Array
    for (let i = 0; i < card_list_complex.length; i++) {
        var a = COCKATRICE_DECK_CARD_TEMPLATE
        var a = a.replace("{NUMBER}", card_list_complex[i].number)
        var a = a.replace("{NAME}", card_list_complex[i].name)
        
        cockatrice_deck_cards_array.push(a)
        
    }
    console.debug(cockatrice_deck_cards_array)
    return cockatrice_deck_cards_array
}


function cockatrice_deckCardListArrayToPlainText(cockatrice_deck_cards_array) {
    let cockatrice_deck_cards_plaintext = cockatrice_deck_cards_array.join("\n        ")
    console.debug(cockatrice_deck_cards_plaintext)
    return cockatrice_deck_cards_plaintext
}


function cockatrice_deckJoin(date, cockatrice_deck_cards_plaintext) {
    var cockatrice_deck = COCKATRICE_DECK_FILE_TEMPLATE
    var cockatrice_deck = cockatrice_deck.replace("{DECKNAME}", date)
    var cockatrice_deck = cockatrice_deck.replace("{COMMENTS}", 'This deck was generated using "MTG card randomizer"')
    var cockatrice_deck = cockatrice_deck.replace("{CARDS}", cockatrice_deck_cards_plaintext)
    console.debug(cockatrice_deck)
    return cockatrice_deck
}


// This function calls all necessary functions to download a Cockatrice deck, and it does so. Doesn't return anything.
function downloadCod() {
    let date = defineDate()
    let card_list_complex = createComplexCardList()
    let cockatrice_deck_cards_array = cockatrice_deckCards(card_list_complex)
    let cockatrice_deck_cards_plaintext = cockatrice_deckCardListArrayToPlainText(cockatrice_deck_cards_array)
    let cockatrice_deck = cockatrice_deckJoin(date, cockatrice_deck_cards_plaintext)
    download(cockatrice_deck, "Cockatrice_" + date + ".cod", "text/plain")
}


export { addCardToList, downloadCod }
